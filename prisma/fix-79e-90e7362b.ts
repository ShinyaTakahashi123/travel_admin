/**
 * #79 90e7362b prayer-checkの指摘。西福寺開山堂(寺院)に配慮の一文がなかったため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await (await import("../src/lib/prisma")).prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;

  const spot = await findSpotInItinerary(itinId, { spotName: "西福寺開山堂" });
  const from = "拝観時間・拝観料・ガイドの申し込みは公式サイトで確かめてから訪れましょう。";
  const to = "静かに、敬意をもって拝観しましょう。拝観時間・拝観料・ガイドの申し込みは公式サイトで確かめてから訪れましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("西福寺開山堂: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
