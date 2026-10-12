/**
 * #126 c898c3d9の直し(2回目)。fix-126でアクアワールドの絶対表現・終わりの
 * 一文は直したが、冒頭の案内役の話し方(「皆様、続いてご案内するのは」)と
 * 「のだそうです」を直し忘れていた。itinerary-audit/flow-checkの出力を
 * 見ていて気づいた自己点検での修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const OPENER_FROM = "皆様、続いてご案内するのはアクアワールド茨城県大洗水族館です。";
const OPENER_TO = "大洗磯前神社から車でおよそ10分、アクアワールド茨城県大洗水族館に着きます。";

const DARE_FROM = "日本で初めて繁殖に成功した種も少なくないのだそうです。";
const DARE_TO = "日本で初めて繁殖に成功した種も少なくありません。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c898c3d9%'`);
  const itinId = rows[0].id;
  const aqua = await findSpotInItinerary(itinId, { spotName: "アクアワールド茨城県大洗水族館" });

  if (!aqua.memo?.includes(OPENER_FROM) || !aqua.memo?.includes(DARE_FROM)) {
    throw new Error("アクアワールドの文言が想定外です");
  }

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(
    itinId,
    { spotId: aqua.id },
    { memo: aqua.memo!.replace(OPENER_FROM, OPENER_TO).replace(DARE_FROM, DARE_TO) }
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
