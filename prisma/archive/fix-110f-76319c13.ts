/**
 * #110 76319c13の直し(2回目)。氷川丸の座標修正(fix-110e)にともない、
 * 氷川丸→横浜中華街の距離が0.7kmになり、申告の5分では速すぎる
 * (時速8.4km)とitinerary-audit.cjsで指摘された。実際の距離に合わせて
 * 9分に直し、visitTimeも連動させる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76319c13%'`);
  const itinId = rows[0].id;
  const chukagai = await findSpotInItinerary(itinId, { spotName: "横浜中華街" });
  const kanteibyo = await findSpotInItinerary(itinId, { spotName: "関帝廟" });
  const mazubyo = await findSpotInItinerary(itinId, { spotName: "横浜媽祖廟" });

  console.log("現在:", chukagai.visitTime, chukagai.transitDurationMin);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: chukagai.id }, { visitTime: t(14, 50), transitDurationMin: 9 });
  await updateSpotInItinerary(itinId, { spotId: kanteibyo.id }, { visitTime: t(15, 53) });
  await updateSpotInItinerary(itinId, { spotId: mazubyo.id }, { visitTime: t(16, 16) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
