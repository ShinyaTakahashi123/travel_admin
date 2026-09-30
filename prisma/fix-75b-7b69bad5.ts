/**
 * #75 7b69bad5 flow-checkで見つかった既存の不足。単日プランに昼食の一言が
 * 一つもなかったため元伊勢籠神社(12:35〜13:05、参道周辺)に追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await (await import("../src/lib/prisma")).prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7b69bad5%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "元伊勢籠神社" });
  const from = "静かに、敬意をもってお参りください。この後は、ケーブルカーとあわせておよそ5分、傘松公園へ向かいましょう。";
  const to = "静かに、敬意をもってお参りください。参道周辺には食事処もあるので、ここで昼食にしましょう。この後は、ケーブルカーとあわせておよそ5分、傘松公園へ向かいましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("元伊勢籠神社: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
