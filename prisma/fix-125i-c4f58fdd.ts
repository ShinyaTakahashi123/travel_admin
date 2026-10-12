/**
 * #125 c4f58fddの直し(9回目)。法務(2026-10-11、記録f7034d5)の指摘:
 * たつこの鏡岩への山道(230段の階段)にクマの一文がない。Day2のブナ林
 * 遊歩道と同じ決まりの文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "足元が滑りやすい場所もあるので、気をつけて歩きましょう。";
const TO =
  "足元が滑りやすい場所もあるので、気をつけて歩きましょう。クマが出ることもあるので、鈴を鳴らして歩き、決められた道から外れず、もし出会ったら騒がず静かにその場を離れましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;
  const kagamiiwa = await findSpotInItinerary(itinId, { spotName: "たつこの鏡岩" });

  if (!kagamiiwa.memo?.includes(FROM)) throw new Error("たつこの鏡岩の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kagamiiwa.id }, { memo: kagamiiwa.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
