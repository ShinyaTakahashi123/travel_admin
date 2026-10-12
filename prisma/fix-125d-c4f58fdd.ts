/**
 * #125 c4f58fddの直し(4回目)。prayer-check.cjsの指摘:
 * 御座石神社(実在の神社)に、参拝の際の配慮の一文がない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "境内には、辰子姫の伝説にちなむ岩や木もあります。";
const TO = "境内には、辰子姫の伝説にちなむ岩や木もあります。ほかの参拝者の迷惑にならないよう、静かにお参りしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;
  const gozaishi = await findSpotInItinerary(itinId, { spotName: "御座石神社" });

  if (!gozaishi.memo?.includes(FROM)) throw new Error("御座石神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: gozaishi.id }, { memo: gozaishi.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
