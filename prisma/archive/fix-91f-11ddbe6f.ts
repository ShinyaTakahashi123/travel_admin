/**
 * #91 11ddbe6f 法務(22:54)の指摘。前浜ビーチのメモで集落散策を勧めているが、
 * 住民の方への配慮の一文がなかったため追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "昼食は、島には店が少ないため、あらかじめ用意しておくと安心です。";
const TO =
  "島の人が暮らす集落です。家の敷地に入ったり、住民の方を撮ったりせず、静かに歩きましょう。昼食は、島には店が少ないため、あらかじめ用意しておくと安心です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;
  const maehama = await findSpotInItinerary(itinId, { spotName: "前浜ビーチ" });
  if (!maehama.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: maehama.id }, { memo: maehama.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
