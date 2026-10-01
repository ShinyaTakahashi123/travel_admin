/**
 * #108 6dd8f74fの直し(2回目)。prayer-check.cjsで、少林山達磨寺の配慮の
 * 一文に「敬意」「手を合わせ」のいずれも入っていないことが判明(fix-108で
 * 書いた文言の抜け)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "今も法要が営まれる祈りの場ですので、境内では静かにお参りください。";
const TO = "今も法要が営まれる祈りの場ですので、境内では敬意を込めて静かにお参りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;
  const darumaji = await findSpotInItinerary(itinId, { spotName: "少林山達磨寺" });

  if (!darumaji.memo!.includes(FROM)) throw new Error("少林山達磨寺の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: darumaji.id }, { memo: darumaji.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
