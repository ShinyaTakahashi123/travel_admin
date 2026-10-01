/**
 * #117 84dca3bfの直し(3回目)。企画運営(15:56)の指摘。上高地
 * インフォメーションセンターの30分が「バスまで過ごす」待ち時間に
 * 見えるため、展示見学としての15分に短縮し、言い方も直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM =
  "小梨平キャンプ場から歩いておよそ9分、この旅の締めくくり、上高地バスターミナルのそばにある上高地インフォメーションセンターに着きます。上高地の自然や登山、交通、施設の情報を提供する施設で、2階のギャラリーでは写真展などのイベントも開かれています。今日歩いた上高地の一日を振り返りながら、帰りのバスの時間まで過ごしましょう。バスターミナルから、沢渡か平湯行きのバスで帰りましょう。";
const TO =
  "小梨平キャンプ場から歩いておよそ9分、この旅の締めくくり、上高地バスターミナルのそばにある上高地インフォメーションセンターに着きます。上高地の自然や登山、交通、施設の情報を提供する施設で、2階のギャラリーでは写真展などのイベントも開かれています。館内の展示を見学して、今日歩いた上高地の一日を振り返りましょう。バスターミナルから、沢渡か平湯行きのバスで帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '84dca3bf%'`);
  const itinId = rows[0].id;
  const info = await findSpotInItinerary(itinId, { spotName: "上高地インフォメーションセンター" });

  if (!info.memo!.includes(FROM)) throw new Error("上高地インフォメーションセンターの文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: info.id }, { memo: TO, stayDurationMin: 15 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
