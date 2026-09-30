/**
 * #92 1fdbcd75 fix-92の直後、itinerary-auditで2件検出(いずれも既存の
 * 前からあった本文で、これまで見直しが及んでいなかった箇所)。
 * 1) サッポロビール博物館「日本で最も長い歴史を持ち」の言い切りをヘッジ。
 * 2) 狸小路商店街「8月第一土曜日」に曜日の指定があり、決まりの時刻・日程の
 *    記載にあたるため、具体的な日にちを書かない表現に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const BEER_FROM = "ビール博物館としては日本で最も長い歴史を持ち、そのルーツは";
const BEER_TO = "ビール博物館としては日本で最も長い歴史を持つといわれ、そのルーツは";

const TANUKI_FROM = "商店街の一角には「狸大明神」「狸神社」が祀られ、毎年1月2日の「初狸祭」、8月第一土曜日の「狸八徳例大祭」で賑わいます。";
const TANUKI_TO = "商店街の一角には「狸大明神」「狸神社」が祀られ、毎年「初狸祭」「狸八徳例大祭」といった祭りで賑わいます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1fdbcd75%'`);
  const itinId = rows[0].id;

  const beer = await findSpotInItinerary(itinId, { spotName: "サッポロビール博物館" });
  const tanuki = await findSpotInItinerary(itinId, { spotName: "狸小路商店街" });

  if (!beer.memo!.includes(BEER_FROM)) throw new Error("一致しません(ビール博物館)");
  if (!tanuki.memo!.includes(TANUKI_FROM)) throw new Error("一致しません(狸小路)");

  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: beer.id }, { memo: beer.memo!.replace(BEER_FROM, BEER_TO) });
  await updateSpotInItinerary(itinId, { spotId: tanuki.id }, { memo: tanuki.memo!.replace(TANUKI_FROM, TANUKI_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
