/**
 * #361の続き。fix-361実行直後のitinerary-audit.cjsで、千尋の滝の時刻が1分ずれている
 * (間11分/移動10分)のを発見。尾の間温泉(13:40終了)+車10分→13:50のはずが、千尋の滝の
 * visitTimeを13:51と書き間違えていたため、後続のトローキの滝(14:26→14:25)・
 * 屋久杉自然館(15:16→15:15)も1分ずつ修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-361b-c4c63223.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "c4c63223-3f2b-4c45-a93e-030a42ff13a9";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const senpiro = await prisma.spot.findFirstOrThrow({ where: { name: "千尋の滝", day: { itineraryId: ITIN_ID } } });
  if (senpiro.visitTime?.toISOString().slice(11, 16) === "13:50") {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: senpiro.id }, { visitTime: T(13, 50) });
  console.log("千尋の滝: 13:51→13:50");

  const trooki = await prisma.spot.findFirstOrThrow({ where: { name: "トローキの滝", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: trooki.id }, { visitTime: T(14, 25) });
  console.log("トローキの滝: 14:26→14:25");

  const shizenkan = await prisma.spot.findFirstOrThrow({ where: { name: "屋久杉自然館", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: shizenkan.id }, { visitTime: T(15, 15) });
  console.log("屋久杉自然館: 15:16→15:15");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
