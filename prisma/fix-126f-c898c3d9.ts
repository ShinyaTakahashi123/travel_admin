/**
 * #126 c898c3d9の直し(6回目)。企画運営(2026-10-11)の指摘:
 * 1. 偕楽園の結びが「茨城県立歴史館へ」のままだった(fix-126dで常磐神社・
 *    徳川ミュージアムを間に挟んだ際の直し忘れ)。「常磐神社へ」に修正。
 * 2. 千波湖の座標(36.370000,140.461109)が丸めた値だった。OSMの名前つきの
 *    点「千波湖北」(36.3723247,140.4621259)に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KAIRAKUEN_FROM = "この後は、車でおよそ10分、茨城県立歴史館へ向かいましょう。";
const KAIRAKUEN_TO = "この後は、歩いておよそ5分、常磐神社へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c898c3d9%'`);
  const itinId = rows[0].id;
  const kairakuen = await findSpotInItinerary(itinId, { spotName: "偕楽園" });
  const senbako = await findSpotInItinerary(itinId, { spotName: "千波湖" });

  if (!kairakuen.memo?.includes(KAIRAKUEN_FROM)) throw new Error("偕楽園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kairakuen.id }, { memo: kairakuen.memo!.replace(KAIRAKUEN_FROM, KAIRAKUEN_TO) });
  await updateSpotInItinerary(itinId, { spotId: senbako.id }, { lat: 36.3723247, lng: 140.4621259 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
