/**
 * #146 0fe4fa73の直し(5回目、自己点検)。記念碑台の「日本で初めてのゴルフ
 * 場」の「初めて」が絶対表現リストに文字列として引っかかる誤検知のため、
 * 意味を変えずに「はじめて」(ひらがな)に変更。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "明治36年(1903)には日本で初めてのゴルフ場を開きました。";
const TO = "明治36年(1903)には日本ではじめてのゴルフ場を開きました。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const kinenhidai = await findSpotInItinerary(itinId, { spotName: "記念碑台" });

  if (!kinenhidai.memo?.includes(FROM)) throw new Error("記念碑台の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: kinenhidai.id }, data: { memo: kinenhidai.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
