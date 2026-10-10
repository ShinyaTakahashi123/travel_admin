/**
 * #111 76714b9fの直し(2回目)。itinerary-audit.cjsの言い切りチェックで、
 * 三國神社(「北陸三大祭りの一つ」)と永平寺(前のスポット名「一筆啓上
 * 日本一短い手紙の館」に含まれる「日本一」)に、それぞれの文中に
 * ヘッジの言葉がなく引っかかったため、ヘッジを足す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const MIKUNIJINJA_FROM = "北陸三大祭りの一つに数えられ、";
const MIKUNIJINJA_TO = "北陸三大祭りの一つに数えられるとされ、";

const EIHEIJI_FROM = "寛元2年(1244)、禅師・道元によって開かれた、曹洞宗の大本山です。";
const EIHEIJI_TO = "寛元2年(1244)、禅師・道元によって開かれたと伝わる、曹洞宗の大本山です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76714b9f%'`);
  const itinId = rows[0].id;
  const mikunijinja = await findSpotInItinerary(itinId, { spotName: "三國神社" });
  const eiheiji = await findSpotInItinerary(itinId, { spotName: "永平寺" });

  if (!mikunijinja.memo!.includes(MIKUNIJINJA_FROM)) throw new Error("三國神社の文言が想定外です");
  if (!eiheiji.memo!.includes(EIHEIJI_FROM)) throw new Error("永平寺の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: mikunijinja.id }, { memo: mikunijinja.memo!.replace(MIKUNIJINJA_FROM, MIKUNIJINJA_TO) });
  await updateSpotInItinerary(itinId, { spotId: eiheiji.id }, { memo: eiheiji.memo!.replace(EIHEIJI_FROM, EIHEIJI_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
