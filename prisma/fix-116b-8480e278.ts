/**
 * #116 8480e278の直し(2回目)。itinerary-audit.cjsで2点:
 * 1. 猪苗代湖の「福島県最大の湖でもあります」にヘッジがなく言い切りと
 *    判定されたため、「とされ」を加える
 * 2. 会津民俗館のvisitTimeが12:17で、野口英世記念館の終わり(12:15)+
 *    移動3分=12:18と1分ずれていたため修正
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INAWASHIROKO_FROM = "福島県最大の湖でもあります。";
const INAWASHIROKO_TO = "福島県最大の湖とされています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const inawashiroko = await findSpotInItinerary(itinId, { spotName: "猪苗代湖" });
  const minzokukan = await findSpotInItinerary(itinId, { spotName: "会津民俗館" });

  if (!inawashiroko.memo!.includes(INAWASHIROKO_FROM)) throw new Error("猪苗代湖の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: inawashiroko.id }, { memo: inawashiroko.memo!.replace(INAWASHIROKO_FROM, INAWASHIROKO_TO) });
  await updateSpotInItinerary(itinId, { spotId: minzokukan.id }, { visitTime: t(12, 18) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
