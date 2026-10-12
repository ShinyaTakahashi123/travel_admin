/**
 * #363の続き。fix-363cで蔵王中央ロープウェイの座標修正が、DBの小数点以下6桁への
 * 丸め(38.165778)と自分のチェック文字列(38.1657779)が一致せず、適用されていな
 * かったため直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363d-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "ca4cf898-7e26-4db6-89da-0d1af4d45c81";

async function main() {
  const chuoRopeway = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王中央ロープウェイ", day: { itineraryId: ITIN_ID } } });
  if (chuoRopeway.lat?.toString() === "38.164846") {
    console.log("既に対応済み");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: chuoRopeway.id }, { lat: 38.164846, lng: 140.395669 });
  console.log("蔵王中央ロープウェイ: 座標を乗り場(温泉駅)の実点に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
