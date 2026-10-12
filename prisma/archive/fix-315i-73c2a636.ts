/**
 * #315の続き(企画運営の指摘、2026-09-30 20:32 JST、急ぎではない)。
 * 児島虎次郎記念館の住所が「倉敷市本町1160」だったが、OSMの建物の住所と
 * 倉敷市公式ページでは「倉敷市本町3-1」とのことで訂正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315i-73c2a636.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "児島虎次郎記念館" },
  });
  if (s.address === "倉敷市本町1160") {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { address: "倉敷市本町3-1" });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
