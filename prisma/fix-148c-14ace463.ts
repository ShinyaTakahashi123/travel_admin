/**
 * #148 14ace463の直し(3回目、自己点検)。prayer-checkで荒神神社に配慮の
 * 一文が見当たらないと検出されたため、「静かに参拝しましょう」を
 * 「静かに、敬意をもって参拝しましょう」に直す(他の神社と同じ言い方)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "権現様がまつられているので、静かに参拝しましょう。";
const TO = "権現様がまつられているので、静かに、敬意をもって参拝しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const gojin = await findSpotInItinerary(itinId, { spotName: "荒神神社" });

  if (!gojin.memo?.includes(FROM)) throw new Error("荒神神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: gojin.id }, data: { memo: gojin.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
