/**
 * #431 83518f0d の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 2日目: 二条市場 → さっぽろテレビ塔 → 札幌市時計台 → すすきの（昼食）→ サッポロビール博物館 →（バスと地下鉄）豊平館（新規）→ 中島公園（新規）（7か所 09:00〜16:30）
 *   豊平館は 9時〜17時（入館16時30分まで）・休館日あり（ようこそさっぽろ）。本文に時刻は書かない
 * 本文の出典: ようこそさっぽろ https://www.sapporo.travel/spot/facility/hoheikan/ ・/nakajima_park/
 * 座標の出典: Nominatim（豊平館 43.0462864,141.3525789）、OSM/Overpass（中島公園 way 64747102 43.043888,141.354035）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-431d-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const DAY2_ID = "d6460354-db24-4320-bc2e-ae73b71008f4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["二条市場", "さっぽろテレビ塔", "札幌市時計台", "すすきの", "サッポロビール博物館"].join()) throw new Error("2日目が想定と違います");
  const beer = day.spots[4];
  const from = "北海道の開拓とビールの歴史にふれて、札幌の旅を締めくくりましょう。";
  if (!beer.memo?.includes(from)) throw new Error("ビール博物館の本文が想定と違います");
  const beerMemo = beer.memo.replace(from, "北海道の開拓とビールの歴史にふれたら、札幌の中心部へ戻りましょう。");

  const order = [
    ...day.spots.slice(0, 4).map((s) => ({ id: s.id, data: {} })),
    { id: beer.id, data: { memo: beerMemo } },
    { create: { name: "豊平館", visitTime: t(14, 50), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 35, transitLine: null, lat: 43.046286, lng: 141.352579, address: "北海道札幌市中央区中島公園1-20",
      memo: "ビール博物館からバスで札幌駅へ戻り、地下鉄南北線で中島公園駅へ。中島公園の中に建つ豊平館は、明治天皇が北海道の視察に訪れた明治14年（1881年）に開館した、明治政府の機関が建てた唯一のホテルとされる建物です。日本の伝統的な技術で造られた明治初期の代表的な木造洋風建築で、国の重要文化財に指定されています。白い外壁を縁どる群青色も印象的です。館内では、明治天皇が泊まった客室の再現展示などが見られます。休館日は公式の案内で確かめましょう。" } },
    { create: { name: "中島公園", visitTime: t(15, 45), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 43.043888, lng: 141.354035, address: "北海道札幌市中央区中島公園",
      memo: "豊平館を出て、中島公園を歩きましょう。街の中心にありながら緑が豊かな公園で、春の桜や藤、秋の紅葉など、季節ごとに違う景色が楽しめます。日本庭園には、江戸時代の茶人・小堀遠州の作と伝わる茶室「八窓庵」があり、国の重要文化財の建物を外から見学できます（日本庭園は冬のあいだ閉園）。池のまわりでは足元に気をつけましょう。札幌の街と名所をめぐる旅を、ここで締めくくりましょう。帰りは、地下鉄の中島公園駅から。" } },
  ];
  console.log("2日目: 二条市場 09:00 → テレビ塔 → 時計台 → すすきの（昼食）→ ビール博物館 13:05〜14:15 →（バス・地下鉄35分）豊平館 14:50〜15:40 → 中島公園 15:45〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY2_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
