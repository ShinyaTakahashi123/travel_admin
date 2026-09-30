/**
 * #483 58d676cf（吹屋 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜12:35（吹屋ふるさと村 →（車）広兼邸 →（車）笹畝坑道）で、昼食の一言がなかった
 *   吹屋の施設は10時から開くので、9:30に開く成羽美術館から始め、吹屋の北の旧吹屋小学校から町並みを南へ歩き、ベンガラ館・笹畝坑道・広兼邸と南へ下って締めくくる（戻らない）
 *   吹屋行きのバスは1日に数本（岡山観光WEB）なので、車の旅にする
 *   成羽美術館（新規）9:30〜10:30 →（車35分）旧吹屋小学校（新規）11:05〜11:50 →（歩き5分）旧片山家住宅・郷土館（新規）11:55〜12:45 →（歩き5分）吹屋ふるさと村（昼食）12:50〜14:00
 *   →（車5分）ベンガラ館（新規）14:05〜14:40 →（歩き5分）笹畝坑道 14:45〜15:25 →（車10分）広兼邸 15:35〜16:30
 *   閉まる時刻: 成羽美術館 9:30〜17:00（入館16:30まで・月曜休館）、吹屋の各施設 10:00〜17:00（12月〜3月は16:00まで。郷土館・ベンガラ館は冬は土日月祝、笹畝坑道は冬は土日月の予約制）、旧吹屋小学校 入館15:30まで。本文に時刻・曜日・料金は書かない
 *   車の時間は OSRM の道のり（備中高梁駅→成羽美術館 8.5km、成羽美術館→旧吹屋小学校 16.8km、広兼邸→備中高梁駅 24.1km）に、山道の分を足した
 * 本文の出典: 成羽美術館 https://nariwa-museum.jp/user_guide/ （備中高梁駅からバスで約20分）・ https://www.museum.or.jp/museum/6227 、
 *   高梁観光情報 https://takahasikanko.or.jp/modules/spot/index.php?content_id=50 （旧吹屋小学校）・content_id=22 （旧片山家住宅・郷土館）・content_id=21 （吹屋ふるさと村）・content_id=23 （ベンガラ館）・content_id=24 （笹畝坑道）・content_id=25 （広兼邸）、
 *   吹屋観光協会 https://sites.google.com/site/fukiyakankou/1guan-guang/guan-guang-shi-she （開館・冬の開館日・片山家の創業）、岡山観光WEB https://www.okayama-kanko.jp/okatabi/1587/page （バスの本数）
 * 座標の出典: OSM（成羽美術館 node 1423615619／旧吹屋小学校 node 1423613069／旧片山家住宅 node 3719549889／吹屋ふるさと村 way 836772975／ベンガラ館 node 4941383722／笹畝坑道 node 4941387521／広兼邸 way 836776984）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-483-58d676cf.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "58d676cf-5880-4e4e-959d-39edf2a79d10";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const DESCRIPTION = "安藤忠雄が設計した成羽美術館から、山あいの吹屋へ。木造の旧吹屋小学校、ベンガラ屋の旧片山家住宅、赤い町並みを歩いて昼食をとり、ベンガラ館と笹畝坑道で吹屋を支えた産業にふれ、城のような石垣の広兼邸で締めくくる、車でめぐる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["吹屋ふるさと村", "広兼邸", "笹畝坑道"].join()) throw new Error("構成が想定と違います");
  const [village, hirokane, sasaune] = day.spots;

  const order = [
    { create: mk({ name: "高梁市成羽美術館", h: 9, m: 30, stay: 60, mode: null, min: null, lat: 34.780714, lng: 133.536896, address: "岡山県高梁市成羽町下原1068-3",
      memo: "この旅は車でめぐります。吹屋へ行くバスは本数がとても少ないので、車が便利です。JR備中高梁駅から車で約20分の高梁市成羽美術館へ。成羽出身の洋画家・児島虎次郎の作品や、児島がエジプトや中国などで集めた古美術、成羽で見つかった植物の化石を展示する美術館で、建物は安藤忠雄の設計です。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "旧吹屋小学校", h: 11, m: 5, stay: 45, mode: "car", min: 35, lat: 34.8629595, lng: 133.4705455, address: "岡山県高梁市成羽町吹屋",
      memo: "成羽から山道を車で走り、吹屋の町並みの北の旧吹屋小学校へ。明治6年（1873年）に開校し、明治33年（1900年）に木造の東校舎・西校舎が建てられた学校で、2012年3月まで、現役でもっとも古い木造校舎として使われていたといわれます。岡山県の重要文化財で、修理を終えて、令和4年から見学できるようになりました。山道には道幅の狭いところもあるので、ゆっくり走りましょう。" }) },
    { create: mk({ name: "旧片山家住宅・郷土館", h: 11, m: 55, stay: 50, mode: "walk", min: 5, lat: 34.8617827, lng: 133.4688304, address: "岡山県高梁市成羽町吹屋",
      memo: "小学校から町並みを歩いて、旧片山家住宅へ。宝暦9年（1759年）から200年余り、吹屋のベンガラの製造と販売を手がけた家で、ベンガラ屋の店構えを残す主屋と、製造にかかわる建物が並び、国の重要文化財です。近くの郷土館は、片山家の分家が明治12年（1879年）に完成させた住宅です。冬は郷土館の開く日が限られるので、公式の案内で確かめましょう。" }) },
    { id: village.id, data: { visitTime: t(12, 50), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.8596206, lng: 133.4711301, address: "岡山県高梁市成羽町吹屋",
      memo: "片山家から、町並みを南へ歩きます。吹屋は古くから銅山の町として知られ、江戸時代の中ごろからはベンガラの産地として栄えました。赤銅色の石州瓦とベンガラ色の外観でそろえられた町並みが続き、昭和52年に国の重要伝統的建造物群保存地区に選ばれ、令和2年には日本遺産にも認定されています。このあたりで昼食にしましょう。" + TOWN } },
    { create: mk({ name: "ベンガラ館", h: 14, m: 5, stay: 35, mode: "car", min: 5, lat: 34.8531834, lng: 133.4683567, address: "岡山県高梁市成羽町吹屋",
      memo: "町並みの南から車で少し走って、ベンガラ館へ。ベンガラは、江戸時代の中ごろに全国ではじめて吹屋でつくられたとされる赤い顔料で、この館は、明治のころのベンガラ工場を当時の姿に復元し、昔の道具を展示しています。冬は開く日が限られるので、公式の案内で確かめましょう。" }) },
    { id: sasaune.id, data: { visitTime: t(14, 45), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.8529148, lng: 133.4719897, address: "岡山県高梁市成羽町吹屋",
      memo: "ベンガラ館から歩いてすぐの笹畝坑道へ。大同2年（807年）に発見されたと伝えられる吉岡（吹屋）銅山の坑道で、江戸時代から大正時代まで使われた坑道を復元し、中を歩いて見学できます。坑内は一年を通して15度前後です。坑内では頭上や足元に気をつけましょう。冬は見学できる日が限られ、予約が必要なので、公式の案内で確かめましょう。" } },
    { id: hirokane.id, data: { visitTime: t(15, 35), stayDurationMin: 55, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 34.8390251, lng: 133.467067, address: "岡山県高梁市成羽町中野",
      memo: "笹畝坑道から車で南へ走って、広兼邸へ。大野呂の庄屋・広兼家が、小泉銅山とローハ（ベンガラの原料）の製造で大きな富を築き、江戸時代の末に建てた邸宅です。城にも劣らない堂々とした石垣の上に建ち、映画「八つ墓村」のロケ地にもなりました。12月から3月は閉まる時刻が早くなるので、公式の案内で確かめましょう。銅山とベンガラで栄えた吹屋の旅を、ここで締めくくりましょう。帰りは、車で備中高梁駅へ約40分。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 成羽美術館 9:30 →（車）旧吹屋小学校 11:05 → 旧片山家 11:55 → 吹屋ふるさと村（昼食）12:50 →（車）ベンガラ館 14:05 → 笹畝坑道 14:45 →（車）広兼邸 15:35〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
