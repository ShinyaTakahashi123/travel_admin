/**
 * #29の直し(企画運営の指摘、2026-10-13)。
 * 1. 沼垂テラス商店街の座標が丸め値(37.920074, 139.069000)だったため、
 *    国土地理院の番地検索(新潟県新潟市中央区沼垂東3番5号)の点
 *    (37.921082, 139.070541)に修正(OSMには対応する点・区画が見当たらず)
 * 2. 旧齋藤家別邸→ぽんしゅ館だけバスになるため、旧齋藤家別邸のメモの終わりに
 *    バスの乗り方の一文を追加
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NEW_LAT = 37.921082;
const NEW_LNG = 139.070541;
const BUS_NOTE = "見学のあとは、近くのバス停から新潟駅行きのバスで向かいます(約20分)。";

// 「旧齋藤家別邸」「沼垂テラス商店街」という名前のSpotは他の新潟のしおりにも
// 存在するため、#29(6eb0ef87)のdayId配下のものだけをIDで直接指定する。
const SAITO_SPOT_ID = "ecc519c1-2990-4cad-8ed0-7426560b87bb";

async function main() {
  const numatariPlace = await prisma.placeMaster.findFirst({ where: { name: "沼垂テラス商店街" } });
  const numatariSpot = await prisma.spot.findFirst({ where: { name: "沼垂テラス商店街", day: { itinerary: { id: "6eb0ef87-f3a8-4689-ba24-a2c545d46ccf" } } } });
  const saitoSpot = await prisma.spot.findUnique({ where: { id: SAITO_SPOT_ID } });
  if (!numatariPlace || !numatariSpot || !saitoSpot?.memo) throw new Error("想定と違います");
  if (!saitoSpot.memo.startsWith("新潟の豪商、齋藤家の四代目・齋藤喜十郎が、大正7年(1918)に別邸として建てたものです。")) {
    throw new Error("想定外のメモです(別のスポットを指している可能性)");
  }
  if (saitoSpot.memo.includes(BUS_NOTE)) throw new Error("既にバスの一文があります(想定外)");

  const newSaitoMemo = saitoSpot.memo + BUS_NOTE;

  console.log("[確認OK] 沼垂テラス商店街の座標を丸め値→GSI番地点に修正");
  console.log(`  ${numatariPlace.lat},${numatariPlace.lng} → ${NEW_LAT},${NEW_LNG}`);
  console.log("[確認OK] 旧齋藤家別邸にバスの乗り方の一文を追加");
  console.log("新メモ:", newSaitoMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({ where: { id: numatariPlace.id }, data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "gsi" } });
  await prisma.spot.update({ where: { id: numatariSpot.id }, data: { lat: NEW_LAT, lng: NEW_LNG } });
  await prisma.spot.update({ where: { id: saitoSpot.id }, data: { memo: newSaitoMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
