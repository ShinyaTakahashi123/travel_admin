/**
 * #96 38dec57e の直し(5回目)。企画運営(2026-10-01 10:49)の事実確認指摘:
 * 南京町の「明治元年(1867)の神戸港開港」は年号が誤り。明治元年は1868年
 * (神戸港開港は慶応3年12月7日=新暦1868年1月1日、のち明治に改元)。
 * (1868)に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "明治元年(1867)の神戸港開港とともに中国の人々が住み始めたことから生まれた町で";
const TO = "明治元年(1868)の神戸港開港とともに中国の人々が住み始めたことから生まれた町で";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '38dec57e%'`);
  const itinId = rows[0].id;
  const nankinmachi = await findSpotInItinerary(itinId, { spotName: "南京町" });

  if (!nankinmachi.memo!.includes(FROM)) throw new Error("南京町の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: nankinmachi.id }, { memo: nankinmachi.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
