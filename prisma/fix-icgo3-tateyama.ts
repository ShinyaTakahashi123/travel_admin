/**
 * いちご狩り#3(館山, 57126c5e)の直し(法務指摘、2026-10-13)。
 * 1. 「房総半島最西端」(説明文・洲崎灯台のメモ)を、同じ文の中で
 *    「房総半島の最西端とされる」にぼかす
 * 2. 座標のずれをOSMの実在の地物の点に修正:
 *    大福寺(way 449082498、35.0306441,139.8415806。約190mずれていた)
 *    安房神社(way 727172519、34.9225209,139.8370058。約250mずれていた)
 *    洲崎灯台(way 1081825817、34.9753103,139.7575141。約350mずれていた)
 * 3. 渚の駅たてやま: 出どころ不明だったため、OSMの施設そのものの点
 *    (way 457109726、"渚の駅"たてやま、34.9894180,139.8547911)に修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "57126c5e-52ef-4b79-b3ff-1216c57bb7d8";
const NAGISA_ID = "8486d830-962a-4b4c-b042-f00adc484177";
const DAIFUKUJI_ID = "f6e45745-2522-4979-b3ed-de41c9ea5c2a";
const AWAJINJA_ID = "03a9f984-2700-44e4-86ae-57b7b6da726b";
const SUNOSAKI_ID = "bab398ab-31bf-4ef9-92c9-53d6afea4413";

const OLD_DESC =
  "いくつかの農園が集まる観光いちご園でいちご狩りを楽しんだあと、戦国大名・里見氏の居城跡に建つ館山城(八犬伝博物館)をめぐります。渚の駅たてやまで昼食をとり、坂東三十三観音の結願寺・那古寺、崖の中腹に建つ大福寺(崖観音)、安房国の一宮とされる安房神社、房総半島最西端の洲崎灯台をめぐる日帰りプランです。";
const NEW_DESC =
  "いくつかの農園が集まる観光いちご園でいちご狩りを楽しんだあと、戦国大名・里見氏の居城跡に建つ館山城(八犬伝博物館)をめぐります。渚の駅たてやまで昼食をとり、坂東三十三観音の結願寺・那古寺、崖の中腹に建つ大福寺(崖観音)、安房国の一宮とされる安房神社、房総半島の最西端とされる洲崎にある洲崎灯台をめぐる日帰りプランです。";

const SUNOSAKI_MEMO_NEW =
  "大正8年(1919)に初めて灯台がともった、房総半島の最西端とされる洲崎に立つ灯台です。コンクリート造りの灯台としては初期のもので、国の登録有形文化財に指定されています。東京湾の入口を見渡す眺めが広がります。";

const fixes = [
  { id: NAGISA_ID, lat: 34.989418, lng: 139.8547911, label: "渚の駅たてやま(OSM way 457109726)" },
  { id: DAIFUKUJI_ID, lat: 35.0306441, lng: 139.8415806, label: "大福寺(OSM way 449082498)" },
  { id: AWAJINJA_ID, lat: 34.9225209, lng: 139.8370058, label: "安房神社(OSM way 727172519)" },
  { id: SUNOSAKI_ID, lat: 34.9753103, lng: 139.7575141, label: "洲崎灯台(OSM way 1081825817)" },
];

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("説明文が想定と違います");
  const spots = await Promise.all(fixes.map((f) => prisma.spot.findUnique({ where: { id: f.id } })));
  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i];
    if (!s) throw new Error("想定と違います: " + fixes[i].id);
    console.log(fixes[i].label, ":", s.lat, s.lng, "→", fixes[i].lat, fixes[i].lng);
  }
  console.log("[確認OK] 説明文・洲崎灯台メモの「房総半島最西端」をぼかす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  await prisma.spot.update({ where: { id: SUNOSAKI_ID }, data: { memo: SUNOSAKI_MEMO_NEW } });

  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i]!;
    const f = fixes[i];
    if (s.placeMasterId) {
      await prisma.placeMaster.update({ where: { id: s.placeMasterId }, data: { lat: f.lat, lng: f.lng, positionSource: "osm" } });
    }
    await prisma.spot.update({ where: { id: s.id }, data: { lat: f.lat, lng: f.lng } });
  }
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
