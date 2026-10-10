/**
 * #327の続き。flow-checkで「帰りの一言なし」を検出(青根温泉、D2最後の
 * スポット、1泊2日の旅の締め)。宮城川崎ICが青根温泉から車でおよそ
 * 20分(WebSearchで複数サイト確認)のため、それを使った帰りの一言を
 * 追加した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327b-8a15b42c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const aone = await prisma.spot.findFirstOrThrow({
    where: { name: "青根温泉", day: { itineraryId: ITIN_ID } },
  });
  const old = "蔵王の山あいに抱かれた温泉街を、ゆっくりと歩いてみましょう。見学を終えたら、蔵王の旅を締めくくりましょう。";
  const next =
    "蔵王の山あいに抱かれた温泉街を、ゆっくりと歩いてみましょう。見学を終えたら、車でおよそ20分の宮城川崎インターチェンジから高速道路に乗るなどして、帰路につきましょう。";
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
