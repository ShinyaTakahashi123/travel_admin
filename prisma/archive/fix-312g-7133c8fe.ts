/**
 * #312の続き3(法務の指摘、2026-09-30 19:24 JST)。
 * 奥祖谷二重かずら橋に、足元のすき間・揺れについての安全の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312g-7133c8fe.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "奥祖谷二重かずら橋" },
  });
  const old = "2本のかずら橋を渡り、山深い祖谷の秘境らしい景観を味わってみましょう。";
  const next =
    "足元のすき間が広く揺れるので、両側のかずらをつかんで、ゆっくり渡りましょう。2本のかずら橋を渡り、山深い祖谷の秘境らしい景観を味わってみましょう。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
