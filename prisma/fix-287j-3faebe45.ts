/**
 * #287の続き(企画運営の指摘、2026-09-30 19:01 JST)。
 * 男体山山頂の本文に「御幸ヶ原からケーブルカーで登ってきた参拝者や
 * 登山者が訪れます」が残っていた。ケーブルカーは運休中で、この旅の
 * 経路からも外したため、「ケーブルカーで」を削除。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287j-3faebe45.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "男体山山頂" },
  });
  const old = "御幸ヶ原からケーブルカーで登ってきた参拝者や登山者が訪れます。";
  const next = "御幸ヶ原から登ってきた参拝者や登山者が訪れます。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
