/**
 * #349の続き。prayer-checkで青島神社に配慮の一文がないと出た(誤検知では
 * なく実際に抜けていた)。祈りの一文を追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-349c-af30d135.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";

async function main() {
  const aoshima = await prisma.spot.findFirstOrThrow({ where: { name: "青島神社", day: { itineraryId: ITIN_ID } } });

  const old = "南国情緒あふれる島内を歩き、海に囲まれた神社ならではの雰囲気を味わいましょう。";
  const next =
    "今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。南国情緒あふれる島内を歩き、海に囲まれた神社ならではの雰囲気を味わいましょう。";

  if (!aoshima.memo?.includes(old)) {
    if (aoshima.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: aoshima.id }, { memo: aoshima.memo.replace(old, next) });
  console.log("aoshima courtesy line added");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
