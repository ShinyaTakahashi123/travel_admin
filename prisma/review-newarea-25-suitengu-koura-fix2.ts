/**
 * #25の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 水天宮「壇ノ浦で入水した安徳天皇」: 命を絶つ言い方(入水)を避ける決まりのため
 *   「壇ノ浦の戦いで亡くなった安徳天皇」に直す
 * 2. 会社名を消す: ワイナリーの「若竹屋酒造場が営む」、説明文・石橋文化センターの
 *   メモの「ブリヂストン」を削除
 * 3. 高良大社の座標: 「高良神社 駐車場」(駐車場の点)を使っていたため、OSMの
 *   高良大社本殿の建物の点(way id 88538148、amenity=place_of_worship、
 *   religion=shinto)に直す
 * 4. 高良大社「山頂からは筑後平野を一望できます」: 大社は山の中腹にあり、山頂へ
 *   行く行程ではないため「境内からは筑後平野を見渡せます」に直す
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "a54e45e0-4329-473b-abb3-b6cd6aca7327";
const NEW_KOURA_LAT = 33.301122;
const NEW_KOURA_LNG = 130.5653304;

const NEW_DESCRIPTION =
  "全国水天宮の総本宮から、久留米出身の実業家・石橋正二郎ゆかりの石橋文化センター、筑後国一の宮・高良大社、河童伝説が伝わる田主丸のかっぱ駅と巨峰ワイナリーまで、久留米市の歴史と物語をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。";

async function main() {
  const suitengu = await prisma.spot.findFirst({ where: { name: "水天宮" } });
  const ishibashi = await prisma.spot.findFirst({ where: { name: "石橋文化センター・久留米市美術館" } });
  const winery = await prisma.spot.findFirst({ where: { name: { contains: "巨峰ワイナリー" } } });
  const koura = await prisma.spot.findFirst({ where: { name: "高良大社" } });
  if (!suitengu?.memo || !ishibashi?.memo || !winery?.memo || !koura?.memo) throw new Error("想定と違います");

  const newSuitenguMemo = suitengu.memo.replace(
    "建久年間(1190〜1199)、壇ノ浦で入水した安徳天皇と平家一門の霊を祀る祠を建てたのがはじまりと伝わります。",
    "建久年間(1190〜1199)、壇ノ浦の戦いで亡くなった安徳天皇と平家一門の霊を祀る祠を建てたのがはじまりと伝わります。"
  );
  const newIshibashiMemo = ishibashi.memo.replace(
    "昭和31年(1956)、ブリヂストンの創業者で久留米市の名誉市民でもある石橋正二郎が、会社創立25周年を記念して久留米市に寄贈した文化施設です。",
    "昭和31年(1956)、久留米出身の実業家で、久留米市の名誉市民でもある石橋正二郎が、会社の創立25周年を記念して久留米市に寄贈した文化施設です。"
  );
  const newWineryMemo = winery.memo.replace(
    "若竹屋酒造場が営むこの施設は、福岡県内で最も古いワイナリーの一つとされ、",
    "この施設は、福岡県内で最も古いワイナリーの一つとされ、"
  );
  const newKouraMemo = koura.memo.replace("山頂からは筑後平野を一望できます。", "境内からは筑後平野を見渡せます。");

  if (
    newSuitenguMemo === suitengu.memo ||
    newIshibashiMemo === ishibashi.memo ||
    newWineryMemo === winery.memo ||
    newKouraMemo === koura.memo
  ) {
    throw new Error("置換対象が見つかりません");
  }

  console.log("[確認OK] 水天宮の「入水」を「壇ノ浦の戦いで亡くなった」に直す");
  console.log("[確認OK] 説明文・石橋文化センターのメモから「ブリヂストン」を削除");
  console.log("[確認OK] ワイナリーのメモから「若竹屋酒造場が営む」を削除");
  console.log("[確認OK] 高良大社の座標を本殿の実点に直す(駐車場の点から変更)");
  console.log("[確認OK] 高良大社の「山頂から」を「境内から」に直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: suitengu.id }, data: { memo: newSuitenguMemo } });
  await prisma.spot.update({ where: { id: ishibashi.id }, data: { memo: newIshibashiMemo } });
  await prisma.spot.update({ where: { id: winery.id }, data: { memo: newWineryMemo } });
  await prisma.spot.update({ where: { id: koura.id }, data: { memo: newKouraMemo, lat: NEW_KOURA_LAT, lng: NEW_KOURA_LNG } });
  await prisma.placeMaster.update({
    where: { id: koura.placeMasterId! },
    data: { lat: NEW_KOURA_LAT, lng: NEW_KOURA_LNG, positionSource: "osm" },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
