/**
 * #101 5bc07d20 の直し(4回目)。法務(2026-10-01 10:46)の指摘:
 * 倉敷美観地区(今も人が暮らし、商いを営む重要伝統的建造物群保存地区)に、
 * 住む人への一文を追加(#98の相倉・菅沼・白川郷と同じ)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "国の重要伝統的建造物群保存地区にも選ばれました。川面をゆったりと進む川舟に揺られながら、江戸時代の情緒あふれる町並みを眺めてみてください。";
const TO = "国の重要伝統的建造物群保存地区にも選ばれました。この町並みには今も暮らす人や商いを営む人がいるため、敷地内に無断で立ち入ったり、窓越しに中をのぞき込んだりしないよう気をつけましょう。川面をゆったりと進む川舟に揺られながら、江戸時代の情緒あふれる町並みを眺めてみてください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5bc07d20%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "倉敷美観地区" });

  if (!spot.memo!.includes(FROM)) throw new Error("倉敷美観地区の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
