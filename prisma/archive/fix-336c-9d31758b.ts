/**
 * #336の続き。fix-336bでtransitDurationMinを3→6分に直した際、本文の
 * 「徒歩でおよそ3分です」を直し忘れていた(つなぎのずれ)。6分に合わせる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-336c-9d31758b.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d31758b-13cf-4d8c-bbdd-87a0361b36db";

async function main() {
  const eirakukan = await prisma.spot.findFirstOrThrow({ where: { name: "出石永楽館", day: { itineraryId: ITIN_ID } } });
  const old = "出石明治館からは歩いておよそ3分です。";
  const next = "出石明治館からは歩いておよそ6分です。";
  if (eirakukan.memo?.includes(next)) {
    console.log("already fixed");
  } else {
    if (!eirakukan.memo?.includes(old)) throw new Error("text not found");
    await updateSpotInItinerary(ITIN_ID, { spotId: eirakukan.id }, { memo: eirakukan.memo.replace(old, next) });
    console.log("eirakukan opener text fixed to 6分");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
