/**
 * #485 b79dfc58（郡上八幡 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:00〜12:30（郡上八幡城 →（車）旧庁舎記念館 → 宗祇水）で、昼食の一言がなく、説明文に「日本最古」の言い切りがあった
 *   タイトルの「水と踊り」に合わせ、宗祇水から柳町の水路、郡上おどりの実演がある博覧館、旧庁舎記念館（昼食）、城、城主の祈願所だった八幡神社を歩き、郡上おどりの会場にもなる城下町プラザで締めくくる
 *   #36（慈恩禅寺・郡上本染・職人町・やなか水のこみち・いがわ小径など）と重ならないようにし、重なるのはタイトルの城・宗祇水のほかは、もとからある旧庁舎記念館だけ
 *   宗祇水 9:10〜9:40 →（歩き10分）安養寺（新規）9:50〜10:25 →（歩き5分）柳町（新規）10:30〜10:55 →（歩き5分）郡上八幡博覧館（新規）11:00〜12:00
 *   →（歩き10分）郡上八幡旧庁舎記念館（昼食）12:10〜13:15 →（歩き30分）郡上八幡城 13:45〜15:00 →（歩き15分）八幡神社（新規）15:15〜15:50 →（歩き10分）郡上八幡城下町プラザ（新規）16:00〜16:30
 *   閉まる時刻: 博覧館 9:30〜17:00、城 9:00〜17:00（6〜8月は18:00、11〜2月は16:30まで）、城下町プラザ 8:30〜17:00。本文に時刻・曜日・料金は書かない
 * 本文の出典: 郡上八幡観光協会 https://www.gujohachiman.com/kanko/sightseeing_intown.html （宗祇水・柳町・旧庁舎記念館・博覧館・安養寺）、TABITABI郡上 https://tabitabigujo.com/courses/%E9%83%A1%E4%B8%8A%E5%85%AB%E5%B9%A1%E5%AF%BA%E5%B7%A1%E3%82%8A%E3%82%B3%E3%83%BC%E3%82%B9/ （安養寺の創建・本堂、旧庁舎の建物）、
 *   郡上八幡城 https://www.kankou-gifu.jp/spot/detail_1155.html ・ https://hachiman-castle.com/access/ 、八幡神社 https://tguide.jp/ja/spot/726 、城下町プラザ https://jokamachi-plaza.com/ ・ https://jokamachi-plaza.com/access/ （郡上八幡駅から徒歩25分）
 * 座標の出典: OSM（宗祇水 node 4742153893／安養寺宝物殿 node 1420981183／柳町 node 4829451721／郡上八幡博覧館 node 1421001173／郡上八幡旧庁舎 way 585997742／郡上八幡城 way 585995159）、
 *   八幡神社・城下町プラザは OSM に点がないので地理院の住所検索（八幡町小野1番地 35.752235,136.963455／八幡町殿町69番地 35.751038,136.957764）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-485-b79dfc58.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b79dfc58-26a7-4cbc-b1f2-b089a25ace29";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const DESCRIPTION = "名水百選の第1号に選ばれた宗祇水から、郡上御坊とも呼ばれる安養寺、水路の流れる柳町、郡上おどりの実演が見られる博覧館へ。旧庁舎記念館で昼食をとり、郡上八幡城と城主の祈願所だった八幡神社を訪ね、城下町プラザで締めくくる、水と踊りの城下町を歩く日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["郡上八幡城", "郡上八幡旧庁舎記念館", "宗祇水"].join()) throw new Error("構成が想定と違います");
  const [castle, office, sogi] = day.spots;

  const order = [
    { id: sogi.id, data: { visitTime: t(9, 10), stayDurationMin: 30, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.7499891, lng: 136.9562181, address: "岐阜県郡上市八幡町本町",
      memo: "この旅は歩きでめぐります。長良川鉄道の郡上八幡駅から歩いて約30分、町の中ほどの宗祇水へ。文明3年（1471年）に、連歌の宗匠・飯尾宗祇と領主・東常縁が、この泉のほとりで歌を詠み交わしたと伝わる湧き水で、環境省の「名水百選」の第1号に選ばれたことで知られます。地元の方が今も使う水場ですので、案内に従い、水場を汚さないようにしましょう。" } },
    { create: mk({ name: "安養寺", h: 9, m: 50, stay: 35, mode: "walk", min: 10, lat: 35.7520217, lng: 136.9584618, address: "岐阜県郡上市八幡町柳町",
      memo: "宗祇水から歩いて、柳町の安養寺へ。「郡上御坊」とも呼ばれる大きな寺で、1256年の創建と伝わり、本堂は岐阜県でいちばん大きいといわれます。" + RESPECT }) },
    { create: mk({ name: "柳町", h: 10, m: 30, stay: 25, mode: "walk", min: 5, lat: 35.7544137, lng: 136.9570919, address: "岐阜県郡上市八幡町柳町",
      memo: "安養寺から北へ歩いて、柳町へ。江戸時代には中級から下級の武士が住んだお侍の町で、家々の軒先を洗うように、清らかな水の流れる水路が続きます。水路のそばでは足元に気をつけましょう。" + TOWN }) },
    { create: mk({ name: "郡上八幡博覧館", h: 11, m: 0, stay: 60, mode: "walk", min: 5, lat: 35.7534067, lng: 136.9571162, address: "岐阜県郡上市八幡町殿町50",
      memo: "柳町から歩いてすぐの郡上八幡博覧館へ。大正時代に建てられた旧税務署の外観をそのまま残す建物で、郡上八幡の水と踊りと歴史を紹介しています。館内では、郡上おどりの実演がほぼ1時間おきに行われるので、夏の踊りの雰囲気を味わいましょう。" }) },
    { id: office.id, data: { visitTime: t(12, 10), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.7498619, lng: 136.9593734, address: "岐阜県郡上市八幡町島谷520-1",
      memo: "博覧館から南へ歩いて、吉田川にかかる新橋のたもとの郡上八幡旧庁舎記念館へ。木造2階建ての洋風建築で、吉田川の「大瀬」と呼ばれる早瀬を見下ろす、町の中心の観光の拠点です。このあたりで昼食にしましょう。" } },
    { id: castle.id, data: { visitTime: t(13, 45), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 30, transitLine: null, lat: 35.7530831, lng: 136.9614453, address: "岐阜県郡上市八幡町柳町一の平659",
      memo: "旧庁舎記念館から山道を上って、郡上八幡城へ。永禄2年（1559年）に遠藤盛数が砦を築いたのが始まりとされる城で、城のまわりの石垣はすべて岐阜県の史跡、天守は郡上市の有形文化財です。今の天守は、木造で再建された城としては日本でもっとも古いとされます。天守からは、城下町や奥美濃の山並みを見渡せます。山道や石段では足元に気をつけましょう。" } },
    { create: mk({ name: "八幡神社", h: 15, m: 15, stay: 35, mode: "walk", min: 15, lat: 35.752235, lng: 136.963455, address: "岐阜県郡上市八幡町小野1",
      memo: "城から山を下りて、八幡神社へ。郡上八幡の地名の由来となった神社で、吉田川と郡上八幡城の間にあり、代々の城主の祈願所でした。城主が奉納した鎧や刀、絵馬などが残り、8月には郡上おどりの会場にもなります。" + RESPECT }) },
    { create: mk({ name: "郡上八幡城下町プラザ", h: 16, m: 0, stay: 30, mode: "walk", min: 10, lat: 35.751038, lng: 136.957764, address: "岐阜県郡上市八幡町殿町69",
      memo: "八幡神社から歩いて、郡上八幡城下町プラザへ。観光案内所やお土産売り場、無料の休憩所がある交通と交流の拠点で、中央の広場は郡上おどりの会場にもなります。水と踊りの城下町をめぐる旅を、ここで締めくくりましょう。帰りは、プラザに停まる高速バスで、または歩いて約25分の郡上八幡駅から。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 宗祇水 9:10 → 安養寺 9:50 → 柳町 10:30 → 博覧館 11:00 → 旧庁舎記念館（昼食）12:10 → 郡上八幡城 13:45 → 八幡神社 15:15 → 城下町プラザ 16:00〜16:30");
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
