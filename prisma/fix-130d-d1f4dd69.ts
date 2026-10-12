/**
 * #130 d1f4dd69の直し(4回目)。法務の参考指摘(範囲外、2026-10-11)。
 * 「お休みください」「お過ごしください」が案内役の言い方だったため、
 * サイト標準の「〜しましょう」に統一。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const ABEMONJUIN_FROM = "1日目はここまでです。桜井市内などで宿をとり、ゆっくりお休みください。";
const ABEMONJUIN_TO = "1日目はここまでです。桜井市内などで宿をとりましょう。";

const OKADERA_FROM = "境内は祈りの場ですので、敬意を持ってお過ごしください。";
const OKADERA_TO = "境内は祈りの場ですので、敬意を持って過ごしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1f4dd69%'`);
  const itinId = rows[0].id;

  const abemonjuin = await findSpotInItinerary(itinId, { spotName: "安倍文殊院" });
  const okadera = await findSpotInItinerary(itinId, { spotName: "岡寺" });

  if (!abemonjuin.memo?.includes(ABEMONJUIN_FROM)) throw new Error("安倍文殊院の文言が想定外です");
  if (!okadera.memo?.includes(OKADERA_FROM)) throw new Error("岡寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: abemonjuin.id }, { memo: abemonjuin.memo!.replace(ABEMONJUIN_FROM, ABEMONJUIN_TO) });
  await updateSpotInItinerary(itinId, { spotId: okadera.id }, { memo: okadera.memo!.replace(OKADERA_FROM, OKADERA_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
