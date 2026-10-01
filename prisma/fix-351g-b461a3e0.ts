/**
 * #351の続き。fix-351fで最上義光歴史館の滞在を75分に延ばした際、
 * 山形美術館のvisitTimeを直し忘れており(12:43のまま)、itinerary-auditで
 * 「時刻の計算が合わない(間-38分/移動2分)」を検出。12:43→13:23に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351g-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b461a3e0-87c6-48dd-b5e8-886ba0345df7";

async function main() {
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { name: "山形美術館", day: { itineraryId: ITIN_ID } } });

  if (bijutsukan.visitTime?.getUTCHours() === 13 && bijutsukan.visitTime?.getUTCMinutes() === 23) {
    console.log("already fixed, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: bijutsukan.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 23)) });
  console.log("山形美術館: visitTimeを13:23に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
