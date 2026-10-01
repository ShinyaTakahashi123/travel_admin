/**
 * #263の続き。法務10:10の指摘対応(法務の判断ではなく誤字の指摘)。
 * fix-263eで「西南戦争で」を足す際、もとの文に既についていた「西南戦争で」と
 * 重複し「西南戦争で西南戦争で西郷隆盛とともに散った」になっていた。1つ消す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-263f-1f5e18c2.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "1f5e18c2-61b0-4697-aa5f-8067bab107f5";

async function main() {
  const nanshu = await prisma.spot.findFirstOrThrow({ where: { name: "南洲神社・南洲墓地", day: { itineraryId: ITIN_ID } } });

  const dup = "西南戦争で西南戦争で西郷隆盛とともに散った";
  const fixed = "西南戦争で西郷隆盛とともに散った";

  if (!nanshu.memo?.includes(dup)) {
    if (nanshu.memo?.includes(fixed)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: nanshu.id }, { memo: nanshu.memo.replace(dup, fixed) });
  console.log("duplicate wording removed");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
