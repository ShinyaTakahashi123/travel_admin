/**
 * #120 b0b18b71の直し(3回目)。企画運営(2026-10-11)の指摘。
 * 宝登山小動物公園の「うさぎやモルモットなど」は確認できず誤りだった。
 * 公式サイト(hodosan-ropeway.co.jp/zoo/)で確認したところ、ニホンザル・
 * ホンシュウジカ・モルモット・コールダック・ヤギ・羊などがいる(うさぎの
 * 記載はない)。昭和35年に野猿公園として開園した施設のため、ニホンザルと
 * ホンシュウジカを中心に書き直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "うさぎやモルモットなど、小さな動物たちと間近にふれあえる施設です。";
const TO = "ニホンザルやホンシュウジカなど、小さな動物たちと間近にふれあえる施設です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b0b18b71%'`);
  const itinId = rows[0].id;
  const zoo = await findSpotInItinerary(itinId, { spotName: "宝登山小動物公園" });
  if (!zoo.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: zoo.id }, { memo: zoo.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
