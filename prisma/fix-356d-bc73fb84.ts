/**
 * #356の続き。fix-356cで追加した「帰路につき」が、flow-check.cjsの判定語
 * (帰り|駅へ|駅まで|駅から|戻り|戻ります|安全運転)に一致していなかった
 * (「帰路」≠「帰り」)。「帰り」を含む言い方に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-356d-bc73fb84.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bc73fb84-1fc8-4d6f-a6a7-39a20d7f76f5";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "イカの駅つくモール", day: { itineraryId: ITIN_ID } } });
  const old = "九十九湾を眺めながら、のと里山海道を経て帰路につき、能登半島ドライブの旅を締めくくりましょう。";
  const next = "九十九湾を眺めながら、のと里山海道を経て帰りの運転を楽しみ、能登半島ドライブの旅を締めくくりましょう。";
  if (!spot.memo?.includes(old)) {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("イカの駅つくモール: 帰りの一言を「帰り」を含む言い方に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
