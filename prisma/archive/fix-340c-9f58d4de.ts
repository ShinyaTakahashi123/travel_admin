/**
 * #340の続き。fix-340bで大宰府展示館・客館跡の移動時間を直した際、
 * 本文の書き出し(「〜からは歩いておよそN分です」)を直し忘れていた
 * (つなぎのずれ)。実際の分数に合わせる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340c-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f";

async function main() {
  const tenjikan = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府展示館", day: { itineraryId: ITIN_ID } } });
  const oldT = "大宰府政庁跡からは歩いておよそ3分です。";
  const nextT = "大宰府政庁跡からは歩いておよそ7分です。";
  if (!tenjikan.memo?.includes(nextT)) {
    if (!tenjikan.memo?.includes(oldT)) throw new Error("tenjikan text not found");
    await updateSpotInItinerary(ITIN_ID, { spotId: tenjikan.id }, { memo: tenjikan.memo.replace(oldT, nextT) });
    console.log("tenjikan opener fixed to 7min");
  } else {
    console.log("tenjikan already fixed");
  }

  const kyakkanato = await prisma.spot.findFirstOrThrow({ where: { name: "客館跡", day: { itineraryId: ITIN_ID } } });
  const oldK = "大宰府展示館からは歩いておよそ5分です。";
  const nextK = "大宰府展示館からは歩いておよそ11分です。";
  if (!kyakkanato.memo?.includes(nextK)) {
    if (!kyakkanato.memo?.includes(oldK)) throw new Error("kyakkanato text not found");
    await updateSpotInItinerary(ITIN_ID, { spotId: kyakkanato.id }, { memo: kyakkanato.memo.replace(oldK, nextK) });
    console.log("kyakkanato opener fixed to 11min");
  } else {
    console.log("kyakkanato already fixed");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
