/**
 * #124 c1204e30の直し(7回目)。企画運営(2026-10-11)の指摘:
 * 終了が16:27で、日帰り最終日の16:30〜17:00に3分足りない。
 * 滞在を延ばさず、黄金岬→積丹岬の移動(car32分)を、曲がりの多い海沿い・
 * 山道であることを踏まえてcar37分に見直し、終了を16:32に。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const cape = await findSpotInItinerary(itinId, { spotName: "積丹岬" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: cape.id }, {
    visitTime: t(15, 30),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 37, transitLine: null }] },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
