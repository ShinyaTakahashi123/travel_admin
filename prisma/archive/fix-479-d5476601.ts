/**
 * #479 d5476601（由布院 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜12:00（金鱗湖 → 湯の坪街道）で、本文はガイドの語り口だった
 *   朝の金鱗湖から湯の坪街道を駅の方へ、午後は由布院の南側のステンドグラス美術館・宇奈岐日女神社・日帰り温泉をめぐり、由布院駅で締めくくる（戻らない）
 *   金鱗湖 9:10〜10:00 →（歩き10分）COMICO ART MUSEUM YUFUIN（新規）10:10〜11:15 →（歩き5分）湯の坪街道（昼食）11:20〜12:35
 *   →（歩き15分）由布院ステンドグラス美術館（新規）12:50〜13:50 →（歩き5分）宇奈岐日女神社（新規）13:55〜14:25 →（歩き10分）クアージュゆふいん（新規）14:35〜15:50 →（歩き10分）由布院駅アートホール（新規）16:00〜16:30
 *   閉まる時刻: COMICO 9:30〜17:00（入館16:00まで）、ステンドグラス美術館 9:00〜17:00（入館16:30まで）、クアージュ 10:00〜21:00（木曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: るるぶ https://rurubu.jp/andmore/spot/80041030 （JR由布院駅から歩いて30分）、YUFUINFO https://yufuin.gr.jp/spot/spot-1268/ （金鱗湖）・/spot/spot-1285/ （COMICO）・/spot/spot-1277/ （湯の坪街道）・
 *   /spot/spot-1182/ （ステンドグラス美術館）・/spot/spot-1274/ （宇奈岐日女神社）、由布市 https://www.city.yufu.oita.jp/kankou/onsen/onsen_cate1_1/kua （クアージュ）、大分県 https://www.visit-oita.jp/spots/detail/9224 （駅アートホール）
 * 座標の出典: OSM（金鱗湖 way 162781794／COMICO node 14127434568／湯之坪街道 way 414647391／宇奈岐日女神社 way 412349256／クアージュゆふいん way 412391838／由布院駅 way 411437588）、
 *   ステンドグラス美術館は OSM に点がないので地理院の住所検索（湯布院町川上2461番地）33.259785,131.365845
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-479-d5476601.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d5476601-4ed3-4351-a2a5-8025e4211b26";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

const DESCRIPTION = "朝霧で知られる金鱗湖から、湯の坪街道で食べ歩き。隈研吾が設計したCOMICO ART MUSEUM YUFUINやステンドグラス美術館でアートにふれ、宇奈岐日女神社にお参りして、日帰り温泉でひと休み。由布岳を望む由布院を歩いてめぐる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["金鱗湖", "湯の坪街道"].join()) throw new Error("構成が想定と違います");
  const [lake, street] = day.spots;

  const order = [
    { id: lake.id, data: { visitTime: t(9, 10), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.26672, lng: 131.369039, address: "大分県由布市湯布院町川上",
      memo: "この旅は歩きでめぐります。JR由布院駅から歩いて約30分の金鱗湖へ。由布岳のふもとにあり、大分の言葉で「岳ん下ん池」と呼ばれていた湖で、明治17年（1884年）に儒学者の毛利空桑が、夕日に輝く魚の鱗を見て「金鱗湖」と名付けたと伝えられています。湖のまわりには散策路があり、秋から冬の朝には、湖が朝霧に包まれることもあります。水辺では足元に気をつけましょう。" } },
    { create: mk({ name: "COMICO ART MUSEUM YUFUIN", h: 10, m: 10, stay: 65, mode: "walk", min: 10, lat: 33.265269, lng: 131.361577, address: "大分県由布市湯布院町川上2995-1",
      memo: "金鱗湖から湯の坪街道を駅の方へ歩いて、COMICO ART MUSEUM YUFUINへ。由布院の景観に配慮して、建築家・隈研吾が設計した現代美術館で、草間彌生や奈良美智など日本を代表する作家の作品を展示しています。休館日は公式の案内で確かめましょう。" }) },
    { id: street.id, data: { visitTime: t(11, 20), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 33.267102, lng: 131.363906, address: "大分県由布市湯布院町川上",
      memo: "美術館のそばの湯の坪街道へ。白滝橋から約800m続く由布院の目抜き通りで、みやげ物や菓子の店が並び、天気のよい日には由布岳も見えます。食べ歩きをしながら、このあたりで昼食にしましょう。" } },
    { create: mk({ name: "由布院ステンドグラス美術館", h: 12, m: 50, stay: 60, mode: "walk", min: 15, lat: 33.259785, lng: 131.365845, address: "大分県由布市湯布院町川上2461-3",
      memo: "湯の坪街道から南へ歩いて、由布院ステンドグラス美術館へ。1800年代以降のヨーロッパのアンティークのステンドグラスを展示する、日本で初めての本格的なステンドグラス美術館とされます。自然の光で作品を見る「聖ロバート教会」と、照明で照らす「ニールズ・ハウス」の2つの建物があります。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "宇奈岐日女神社", h: 13, m: 55, stay: 30, mode: "walk", min: 5, lat: 33.256859, lng: 131.365493, address: "大分県由布市湯布院町川上2220",
      memo: "美術館から歩いてすぐの宇奈岐日女神社へ。六柱の神をまつることから「六所様」と呼ばれる神社で、湿地だった由布院で、沼の精霊として鰻がまつられたと伝えられています。平成3年の台風で倒れた杉の大木の切り株が、ご神体として残されています。" + RESPECT }) },
    { create: mk({ name: "クアージュゆふいん", h: 14, m: 35, stay: 75, mode: "walk", min: 10, lat: 33.261273, lng: 131.359916, address: "大分県由布市湯布院町川上2863",
      memo: "神社から歩いて、由布市の日帰り温泉、クアージュゆふいんへ。ドイツ式の温泉療法を体験できるクアハウスで、水着を着て運動浴やジャグジー浴、打たせ湯などを楽しめるほか、水着を使わないふつうのお風呂もあります。水着は借りることもできます。休館日は公式の案内で確かめましょう。" + BATH }) },
    { create: mk({ name: "由布院駅アートホール", h: 16, m: 0, stay: 30, mode: "walk", min: 10, lat: 33.262613, lng: 131.355126, address: "大分県由布市湯布院町川北",
      memo: "温泉から歩いて、JR由布院駅へ。駅の中の由布院駅アートホールは、待合室でもありアートギャラリーでもある場所で、約1か月ごとに写真展や工芸品展が開かれています。由布岳のふもとの自然とアートをめぐる旅を、ここで締めくくりましょう。帰りは、由布院駅から。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 金鱗湖 9:10 → COMICO 10:10 → 湯の坪街道（昼食）11:20 → ステンドグラス 12:50 → 宇奈岐日女 13:55 → クアージュ 14:35 → 駅アートホール 16:00〜16:30");
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
