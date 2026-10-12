/**
 * #37 41e37fe5 法務の指摘。曜日は書かない決まりのため、田尻歴史館の
 * 「休館日(毎週水曜日など)があるので」から曜日を外す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "41e37fe5-383f-47ff-9375-dda356f10a9a";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "田尻歴史館" });
  const from = "休館日(毎週水曜日など)があるので、訪れる前に公式サイトで確かめましょう。";
  const to = "休館日があるので、訪れる前に公式サイトで確かめましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("田尻歴史館: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
