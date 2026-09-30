/**
 * 法務(23:39〜23:40)の指摘。#41 2b09beea 対馬丸記念館で、犠牲者数「780人」
 * 「1,484人」に出どころ・時点がなかった。公式サイト(対馬丸記念会,
 * http://www.tsushimamaru.or.jp/tsushimamaru.php)で確認したところ、
 * 疎開者(学童集団疎開)は784名(既存の780人は誤り)、名前が判明している総数
 * 1,484名は「2024年8月22日までに名前が判明した数」との注記があった。
 * 法務の案2(出どころと時点を添えて残す)にあわせ、数を正しい784人に直し、
 * 出どころと時点を明記する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "疎開の学童780人を含む、名前が分かっているだけでも1,484人が犠牲になったとされています。";
const TO = "疎開の学童784人を含む、対馬丸記念館の調べで名前が分かっている人だけで1,484人(2024年8月22日時点)が犠牲になったとされています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '2b09beea%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "対馬丸記念館" });
  if (spot.memo!.includes(TO)) return console.log("すでに反映済みです");
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
