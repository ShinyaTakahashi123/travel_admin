/**
 * #313の続き(法務の指摘、2026-09-30 19:47 JST)。
 * 大公孫樹に2点:
 * 1. 「イチョウの木としては全国で最も早く国の天然記念物に指定されました」
 *    →「…指定されたとされます」にヘッジ。
 * 2. 泉山弁財天の境内であるため、配慮の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313h-720bdfcb.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大公孫樹" },
  });
  let memo = s.memo ?? "";
  memo = memo.replace(
    "大正15年(1926)、イチョウの木としては全国で最も早く国の天然記念物に指定されました。",
    "大正15年(1926)、イチョウの木としては全国で最も早く指定されたとされます。"
  );
  memo = memo.replace(
    "悠久の時を重ねてきた大樹を、見上げてみましょう。",
    "泉山弁財天の境内ですので、静かに、敬意をもって見学しましょう。悠久の時を重ねてきた大樹を、見上げてみましょう。"
  );
  if (memo !== s.memo) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
