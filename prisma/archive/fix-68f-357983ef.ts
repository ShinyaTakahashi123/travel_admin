/**
 * #68 357983ef。fix-68eでtransitDurationMinを25→18分に直したが、大観峰自身の
 * visitTimeを14:25のままにしてしまい、時刻の計算が合わなくなっていた。14:18に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "357983ef-fff3-496a-8a92-1f236f8f24bd";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "大観峰" });
  console.log("現在のvisitTime:", spot.visitTime);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { visitTime: t(14, 18) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
