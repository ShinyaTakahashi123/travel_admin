/**
 * #124 c1204e30の直し(6回目)。fix-124eで美国→黄金岬の移動をcar10→car3に
 * 直したが、黄金岬の到着時刻(14:35)をそのままにしたため、間10分/移動3分の
 * 計算違いが発生。黄金岬を14:28着に、連動して積丹岬も15:25着に7分早める
 * (黄金岬の滞在25分・積丹岬への移動car32分はそのまま)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const ogane = await findSpotInItinerary(itinId, { spotName: "黄金岬" });
  const cape = await findSpotInItinerary(itinId, { spotName: "積丹岬" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: ogane.id }, { visitTime: t(14, 28) });
  await updateSpotInItinerary(itinId, { spotId: cape.id }, { visitTime: t(15, 25) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
