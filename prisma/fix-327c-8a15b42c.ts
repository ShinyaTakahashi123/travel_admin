/**
 * #327の続き。fix-327bで「帰路につきましょう」を追加したが、flow-check
 * の正規表現(/帰り|駅へ|駅まで|駅から|戻り|戻ります|安全運転/)は
 * 「帰路」に一致しないため、依然「帰りの一言なし」と表示された
 * (自己チェック)。「帰り」という字を含む言い回しに直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327c-8a15b42c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const aone = await prisma.spot.findFirstOrThrow({
    where: { name: "青根温泉", day: { itineraryId: ITIN_ID } },
  });
  const old =
    "見学を終えたら、車でおよそ20分の宮城川崎インターチェンジから高速道路に乗るなどして、帰路につきましょう。";
  const next =
    "見学を終えたら、車でおよそ20分の宮城川崎インターチェンジから高速道路に乗るなどして、帰りましょう。";
  if (aone.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!aone.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: aone.id }, { memo: aone.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
