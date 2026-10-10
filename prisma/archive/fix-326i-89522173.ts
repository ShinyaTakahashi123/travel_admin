/**
 * #326の続き。fix-326hでtransitDurationMinを10→15分に直したが、
 * 本文の「歩いておよそ10分です」を直し忘れていた(flow-checkで検出、
 * 自己チェック)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326i-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const jizo = await prisma.spot.findFirstOrThrow({
    where: { name: "地蔵の湯", day: { itineraryId: ITIN_ID } },
  });
  const old = "温泉図書館からは歩いておよそ10分です(坂の上り下りがあるため、直線距離より時間がかかります)。";
  const next = "温泉図書館からは歩いておよそ15分です(坂の上り下りがあるため、直線距離より時間がかかります)。";
  if (jizo.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!jizo.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: jizo.id }, { memo: jizo.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
