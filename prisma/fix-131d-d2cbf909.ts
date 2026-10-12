/**
 * #131 d2cbf909の直し(4回目、自己点検)。fix-131cで、五人百姓の
 * visitTimeと展望台のstayDurationMinを更新し忘れたため、
 * itinerary-auditで時刻の計算が合わない表示が出た。修正する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const goninbyakusho = await findSpotInItinerary(itinId, { spotName: "五人百姓" });
  const tembodai = await findSpotInItinerary(itinId, { spotName: "展望台" });

  console.log("確認OK。五人百姓visitTime:", goninbyakusho.visitTime, "展望台stay:", tembodai.stayDurationMin);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: goninbyakusho.id }, { visitTime: t(9, 22) });
  await updateSpotInItinerary(itinId, { spotId: tembodai.id }, { stayDurationMin: 20 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
