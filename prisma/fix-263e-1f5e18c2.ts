/**
 * #263の続き。法務10:05の指摘対応。
 * 南洲神社・南洲墓地「西郷隆盛とともに散った、2000名を超える薩軍将士が
 * 眠る墓地」の死者数の記載を削除(writing-style 121、死者数は書かない決まり)。
 * あわせて私学校跡「激戦の生々しさを伝えています」も指摘どおり
 * 「激しい戦いの跡を今に伝えています」に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-263e-1f5e18c2.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "1f5e18c2-61b0-4697-aa5f-8067bab107f5";

async function main() {
  const nanshu = await prisma.spot.findFirstOrThrow({ where: { name: "南洲神社・南洲墓地", day: { itineraryId: ITIN_ID } } });
  const shigakko = await prisma.spot.findFirstOrThrow({ where: { name: "私学校跡", day: { itineraryId: ITIN_ID } } });

  const nanshuOld = "西郷隆盛とともに散った、2000名を超える薩軍将士が眠る墓地と、西郷を祭神として祀る神社です。";
  const nanshuNext = "西南戦争で西郷隆盛とともに散った薩軍将士が眠る墓地と、西郷を祭神として祀る神社です。";
  if (!nanshu.memo?.includes(nanshuOld) && !nanshu.memo?.includes(nanshuNext)) {
    throw new Error("nanshu anchor not found");
  }

  const shigakkoOld = "激戦の生々しさを伝えています。";
  const shigakkoNext = "激しい戦いの跡を今に伝えています。";
  if (!shigakko.memo?.includes(shigakkoOld) && !shigakko.memo?.includes(shigakkoNext)) {
    throw new Error("shigakko anchor not found");
  }

  if (nanshu.memo.includes(nanshuOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: nanshu.id }, { memo: nanshu.memo.replace(nanshuOld, nanshuNext) });
    console.log("nanshu death-count removed");
  } else {
    console.log("nanshu already fixed, skipping");
  }

  if (shigakko.memo.includes(shigakkoOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shigakko.id }, { memo: shigakko.memo.replace(shigakkoOld, shigakkoNext) });
    console.log("shigakko wording softened");
  } else {
    console.log("shigakko already fixed, skipping");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
