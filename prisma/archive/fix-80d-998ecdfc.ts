/**
 * 企画運営(2026-10-01 00:15、法務の気づき)の指摘。#80 998ecdfc 広島東照宮の
 * 「標高およそ300mの高台」を確認。国土地理院の標高API(スポットの座標
 * 34.403192,132.475548)で17.7m、二葉山自体もWikipedia等で138〜139mと
 * わかり、300mは誤りだった(「山麓」という既存の書き方とも合っていなかった)。
 * 具体的な標高の数字は外し、実際の立地(二葉山の山麓の高台)だけを書く形にする。
 * 開いたURL: 国土地理院 標高API(https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php)、
 * 二葉山の標高はWikipedia等の集約(138〜139m、YAMAPは131m表記)で確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "二葉山の山麓、標高およそ300mの高台に立つ広島東照宮に着きます。";
const TO = "二葉山の山麓の高台に立つ広島東照宮に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '998ecdfc%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "広島東照宮" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
