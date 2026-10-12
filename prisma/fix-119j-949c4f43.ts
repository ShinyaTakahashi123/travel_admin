/**
 * #119 949c4f43の直し(10回目)。fix-119iで出た監査の⚠2件を直す。
 * ①ドムトールン: 座標を法務の点に直した結果、パレスハウステンボスとの距離が
 *   0.6kmになり、徒歩5分では速すぎた(⚠徒歩が速すぎ)。8分に修正
 * ②アルカスSASEBOの「西九州最大級の規模」を、言い切りを避けて「とされ」を補う
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ARCAS_FROM = "2,000席の大ホールは西九州最大級の規模で、フルオーケストラの演奏にも対応しています。";
const ARCAS_TO = "2,000席の大ホールは西九州最大級の規模とされ、フルオーケストラの演奏にも対応しています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });
  const arcas = await findSpotInItinerary(itinId, { spotName: "アルカスSASEBO" });

  if (!arcas.memo?.includes(ARCAS_FROM)) throw new Error("アルカスSASEBOの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: dom.id }, {
    visitTime: t(16, 9),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
  });
  await updateSpotInItinerary(itinId, { spotId: arcas.id }, { memo: arcas.memo!.replace(ARCAS_FROM, ARCAS_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
