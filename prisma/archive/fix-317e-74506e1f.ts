/**
 * #317の続き(自己チェックの気づき)。
 * fix-317dで、大斎原→つぼ湯の移動を「歩いて20分」から実際の「車で20分」
 * に直したはずが、本文(memo)は直したものの、transitModeフィールド自体を
 * walkからcarに変更し忘れていた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317e-74506e1f.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "湯の峰温泉 つぼ湯" },
  });
  if (s.transitMode === "walk") {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { transitMode: "car" });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: "car", transitDurationMin: s.transitDurationMin! },
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
