/**
 * #363の続き。flow-check.cjsで発見: 蔵王温泉大露天風呂(最終スポット)に
 * 帰りの一言がなかったため追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363b-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "ca4cf898-7e26-4db6-89da-0d1af4d45c81";

async function main() {
  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王温泉大露天風呂", day: { itineraryId: ITIN_ID } } });
  const old = "空中散歩と開放的な露天風呂で、蔵王の自然を存分に味わいましょう。";
  const next =
    "空中散歩と開放的な露天風呂で、蔵王の自然を存分に味わいましょう。湯あみを終えたら、バスで山形駅へ戻り、グリーンシーズンの蔵王を巡る日帰り旅を締めくくりましょう。";
  if (rotenburo.memo?.includes(old) && !rotenburo.memo.includes(next)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: rotenburo.id }, { memo: rotenburo.memo.replace(old, next) });
    console.log("蔵王温泉大露天風呂: 帰りの一言を追加");
  } else {
    console.log("既に対応済み");
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
