/**
 * #134 e0181f83の直し(4回目、自己点検)。fix-134cで「お過ごしください」を
 * 「静かに過ごしましょう」に直した際、「敬意を持って」を落としてしまい、
 * prayer-checkで配慮の一文なしと検出された。「敬意を持って」を戻す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "今も信仰の対象となっている霊山ですので、静かに過ごしましょう。";
const TO = "今も信仰の対象となっている霊山ですので、静かに、敬意を持って過ごしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e0181f83%'`);
  const itinId = rows[0].id;
  const misen = await findSpotInItinerary(itinId, { spotName: "弥山（宮島ロープウェー）" });

  if (!misen.memo?.includes(FROM)) throw new Error("弥山の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: misen.id }, data: { memo: misen.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
