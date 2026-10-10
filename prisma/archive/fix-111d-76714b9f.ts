/**
 * #111 76714b9fの直し(4回目)。prayer-check.cjsで永平寺に配慮の一文が
 * 見当たらないとの指摘。「静かに歩きましょう」は判定語(敬意・手を合わせ)
 * に含まれないため、「敬意」を使った一文に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "拝観の際は、修行の場であることを忘れず、静かに歩きましょう。";
const TO = "拝観の際は、修行の場であることに敬意を払い、静かに歩きましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76714b9f%'`);
  const itinId = rows[0].id;
  const eiheiji = await findSpotInItinerary(itinId, { spotName: "永平寺" });

  if (!eiheiji.memo!.includes(FROM)) throw new Error("永平寺の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: eiheiji.id }, { memo: eiheiji.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
