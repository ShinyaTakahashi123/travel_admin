/**
 * #125 c4f58fddの直し(3回目)。flow-check.cjsの指摘:
 * - 冒頭にレンタカーを借りる一文がなく、車移動の前提が唐突
 * - 最終スポット(角館武家屋敷通り)に帰りの一言がない
 * 田沢湖駅(39.7002861,140.7223789)でレンタカーを借りる想定にし、
 * 角館駅(39.5917027,140.5710250)前で返す一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TATSUKO_FROM = "田沢湖の南西岸、潮瀬崎に着きます。";
const TATSUKO_TO = "JR田沢湖駅前でレンタカーを借りて、車でおよそ15分、田沢湖の南西岸、潮瀬崎に着きます。";

const BUKE_FROM = "通りをゆっくりと歩きながら、時代をさかのぼるような町並みを楽しみましょう。";
const BUKE_TO = "通りをゆっくりと歩きながら、時代をさかのぼるような町並みを楽しみましょう。JR角館駅前でレンタカーを返して、秋田新幹線こまちで帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;
  const tatsuko = await findSpotInItinerary(itinId, { spotName: "たつこ像" });
  const buke = await findSpotInItinerary(itinId, { spotName: "角館武家屋敷通り" });

  if (!tatsuko.memo?.includes(TATSUKO_FROM)) throw new Error("たつこ像の文言が想定外です");
  if (!buke.memo?.includes(BUKE_FROM)) throw new Error("武家屋敷通りの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tatsuko.id }, { memo: tatsuko.memo!.replace(TATSUKO_FROM, TATSUKO_TO) });
  await updateSpotInItinerary(itinId, { spotId: buke.id }, { memo: buke.memo!.replace(BUKE_FROM, BUKE_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
