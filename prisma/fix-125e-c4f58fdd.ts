/**
 * #125 c4f58fddの直し(5回目)。prayer-check.cjsの判定語は「敬意」「手を
 * 合わせ」のみ(「静かに」は2026-09-29に誤検知対策で判定語から除外済み)。
 * fix-125dで入れた「静かにお参りしましょう」は判定語に当たらなかった
 * ため、「敬意を持って」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "ほかの参拝者の迷惑にならないよう、静かにお参りしましょう。";
const TO = "ほかの参拝者の迷惑にならないよう、敬意を持ってお参りしましょう。";

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
