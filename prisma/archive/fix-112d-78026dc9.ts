/**
 * #112 78026dc9の直し(4回目)。prayer-check.cjsで大願寺(実在の寺院)に
 * 配慮の一文がないとの指摘。宮島歴史民俗資料館・宮島水族館は、名前に
 * 「宮島」の「宮」を含むための誤検知(資料館・水族館で信仰の対象では
 * ない)なので、そのままにする。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "平成18年(2006)に再建されたものです。このあたりには食事処も多いので、参拝のあとは、このあたりで昼食にしましょう。";
const TO = "平成18年(2006)に再建されたものです。参拝の際は、敬意を込めて手を合わせましょう。このあたりには食事処も多いので、参拝のあとは、このあたりで昼食にしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const daiganji = await findSpotInItinerary(itinId, { spotName: "大願寺" });

  if (!daiganji.memo!.includes(FROM)) throw new Error("大願寺の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: daiganji.id }, { memo: daiganji.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
