/**
 * #68 357983ef 坂本善三美術館。決まり(曜日は書かない)により「毎週月曜日など」の
 * 曜日を外す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "357983ef-fff3-496a-8a92-1f236f8f24bd";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "坂本善三美術館" });
  const from = "休館日(毎週月曜日など)があるので、訪れる前に公式サイトで確かめましょう。";
  const to = "休館日があるので、訪れる前に公式サイトで確かめましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("坂本善三美術館: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
