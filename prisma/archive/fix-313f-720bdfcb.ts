/**
 * #313の続き(自己チェックの気づき2)。
 * fix-313cで泉山磁石場のtransitMode/transitDurationMinはwalk/15に直した
 * が、本文の書き出し「陶山神社からは車でおよそ5分です」の更新を忘れて
 * いた(flow-check.cjsで発覚)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313f-720bdfcb.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "泉山磁石場" },
  });
  const old = "陶山神社からは車でおよそ5分です。";
  const next = "陶山神社からは歩いておよそ15分です。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
