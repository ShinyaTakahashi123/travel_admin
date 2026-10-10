/**
 * #326の続き。flow-checkで「2日目に昼食の一言なし」を検出。道の駅への
 * 到着(13:00)がちょうどよい時間帯のため、その一言を追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326d-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const michinoeki = await prisma.spot.findFirstOrThrow({
    where: { name: "道の駅 草津運動茶屋公園", day: { itineraryId: ITIN_ID } },
  });
  const old = "温泉図書館からは歩いておよそ15分です。道の駅";
  const next = "温泉図書館からは歩いておよそ15分です。到着したら、まずこのあたりで昼食をとりましょう。道の駅";
  if (michinoeki.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!michinoeki.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: michinoeki.id },
    { memo: michinoeki.memo.replace(old, next) }
  );
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
