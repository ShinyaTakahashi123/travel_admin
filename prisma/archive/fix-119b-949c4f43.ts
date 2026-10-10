/**
 * #119 949c4f43の直し(2回目)。itinerary-audit.cjsの言い切りチェックで、
 * ドムトールンの「同国で最も高い鐘楼」にヘッジがなく引っかかった。
 * また、組み直しでパレスハウステンボスが「昨日」ではなく「今日」の
 * 訪問になったため、「昨日訪れた」の表現も直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM1 = "同国で最も高い鐘楼「ドム塔」をモデルにした展望塔です。";
const TO1 = "同国で最も高い鐘楼とされる「ドム塔」をモデルにした展望塔です。";

const FROM2 = "昨日訪れたパレスハウステンボスの優美な姿も、上から眺めることができます。";
const TO2 = "先ほど訪れたパレスハウステンボスの優美な姿も、上から眺めることができます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });

  if (!dom.memo!.includes(FROM1)) throw new Error("ドムトールンの文言1が想定外です");
  if (!dom.memo!.includes(FROM2)) throw new Error("ドムトールンの文言2が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: dom.id }, { memo: dom.memo!.replace(FROM1, TO1).replace(FROM2, TO2) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
