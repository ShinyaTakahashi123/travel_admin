/**
 * #331の続き。法務2026-10-01 04:59の任意の提案: 天岩戸神社(西本宮)の
 * 「日本神話屈指の名場面の舞台」を、言い切りの心配がないよう
 * 「日本神話でよく知られた場面の舞台」に変更。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-331d-94732fe1.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "94732fe1-b3b9-49ce-8ebc-d610b6c19062";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "天岩戸神社(西本宮)", day: { itineraryId: ITIN_ID } } });
  const old = "日本神話屈指の名場面の舞台";
  const next = "日本神話でよく知られた場面の舞台";
  if (spot.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!spot.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
