/**
 * #313の続き(法務の気づき、2026-09-30 19:48 JST)。
 * fix-313hで「国の天然記念物に」を削ってしまい、「全国で最も早く指定
 * されたとされます」と、何に指定されたのか分からない文になっていた。
 * 「国の天然記念物に」を戻す(ヘッジはそのまま)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313i-720bdfcb.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大公孫樹" },
  });
  const old = "大正15年(1926)、イチョウの木としては全国で最も早く指定されたとされます。";
  const next = "大正15年(1926)、イチョウの木としては全国で最も早く国の天然記念物に指定されたとされます。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
