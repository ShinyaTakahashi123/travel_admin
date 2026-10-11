/**
 * #128 c9b3ad40の直し(5回目)。itinerary-audit.cjsの指摘: 外宮→倭姫宮の
 * 移動(1.8km/8分)が速すぎた(時速13.5km相当)。徒歩の現実的な時間
 * (およそ22分)に修正。ダウンストリームの時刻もあわせてずらす。
 * (神宮徴古館の「配慮の一文なし」指摘は、名称に「宮」を含むだけの
 * 博物館で祈りの場ではないため誤検知と判断)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;

  const yamatohime = await findSpotInItinerary(itinId, { spotName: "倭姫宮" });
  const chokokan = await findSpotInItinerary(itinId, { spotName: "神宮徴古館" });
  const naiku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮内宮" });
  const okage = await findSpotInItinerary(itinId, { spotName: "おかげ横丁" });
  const sarutahiko = await findSpotInItinerary(itinId, { spotName: "猿田彦神社" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(
    itinId,
    { spotId: yamatohime.id },
    { visitTime: t(10, 47), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 22, transitLine: null }] } }
  );
  await updateSpotInItinerary(itinId, { spotId: chokokan.id }, { visitTime: t(11, 27) });
  await updateSpotInItinerary(itinId, { spotId: naiku.id }, { visitTime: t(12, 42) });
  await updateSpotInItinerary(itinId, { spotId: okage.id }, { visitTime: t(14, 27) });
  await updateSpotInItinerary(itinId, { spotId: sarutahiko.id }, { visitTime: t(15, 35) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
