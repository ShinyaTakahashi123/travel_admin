/**
 * #118 8ba48819の直し(2回目)。itinerary-audit.cjsで2点の時刻ずれ。
 * 神田家のvisitTimeが明善寺郷土館の終わり(12:28)と同じになっていた
 * (申告の移動3分が反映されていなかった)ため、神田家以降の時刻を
 * すべて計算し直した。
 * 神田家12:31(35分)→長瀬家13:07(85分)→和田家14:37(40分)→
 * 荻町城跡展望台15:27(80分)、終わり16:47。
 * (「近いのにcar10分」は、展望台が高台にあるための坂道であり、
 * 想定内の誤検知として扱う)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const kandake = await findSpotInItinerary(itinId, { spotName: "神田家" });
  const nagaseke = await findSpotInItinerary(itinId, { spotName: "長瀬家" });
  const wadake = await findSpotInItinerary(itinId, { spotName: "和田家" });
  const tenbodai = await findSpotInItinerary(itinId, { spotName: "荻町城跡展望台" });

  console.log("現在:", kandake.visitTime, nagaseke.visitTime, wadake.visitTime, tenbodai.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kandake.id }, { visitTime: t(12, 31) });
  await updateSpotInItinerary(itinId, { spotId: nagaseke.id }, { visitTime: t(13, 7) });
  await updateSpotInItinerary(itinId, { spotId: wadake.id }, { visitTime: t(14, 37) });
  await updateSpotInItinerary(itinId, { spotId: tenbodai.id }, { visitTime: t(15, 27) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
