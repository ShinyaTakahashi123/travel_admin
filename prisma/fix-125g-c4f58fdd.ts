/**
 * #125 c4f58fddの直し(7回目)。itinerary-audit.cjsの指摘:
 * 武家屋敷通りの到着時刻が15:23だが、桧木内川堤(14:05+70分=15:15)+
 * 徒歩5分=15:20が正しい。3分のずれを修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;
  const buke = await findSpotInItinerary(itinId, { spotName: "角館武家屋敷通り" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: buke.id }, { visitTime: t(15, 20) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
