/**
 * #131 d2cbf909の直し(6回目、自己点検)。fix-131eで大門のstayDurationMin
 * (実際は20分)を25分と思い込んで以降の5スポットのvisitTimeを計算した
 * ため、5分ずつずれていた。itinerary-auditの「時刻の計算が合わない」で
 * 発見し修正する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const takahashiyuichikan = await findSpotInItinerary(itinId, { spotName: "高橋由一館" });
  const asahisha = await findSpotInItinerary(itinId, { spotName: "旭社" });
  const hongu = await findSpotInItinerary(itinId, { spotName: "本宮" });
  const tembodai = await findSpotInItinerary(itinId, { spotName: "展望台" });
  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: takahashiyuichikan.id }, { visitTime: t(13, 1) });
  await updateSpotInItinerary(itinId, { spotId: asahisha.id }, { visitTime: t(13, 36) });
  await updateSpotInItinerary(itinId, { spotId: hongu.id }, { visitTime: t(14, 11) });
  await updateSpotInItinerary(itinId, { spotId: tembodai.id }, { visitTime: t(14, 33) });
  await updateSpotInItinerary(itinId, { spotId: okusha.id }, { visitTime: t(15, 43) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
