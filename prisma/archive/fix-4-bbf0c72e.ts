/**
 * #4 bbf0c72e（箱根紅葉）企画運営の指摘。恩賜箱根公園(D2の途中、最後は箱根関所→成川美術館)
 * の「旅の締めくくりにふさわしい」が、途中に残った古い結びだったため、次の箱根関所への
 * つながりの文に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "bbf0c72e-356a-4ba4-a0d8-d1079aa32493";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "恩賜箱根公園" });
  const from = "箱根神社から湖畔沿いに少し歩くと、旅の締めくくりにふさわしい恩賜箱根公園にたどり着きます。";
  const to = "箱根神社から湖畔沿いに少し歩くと、恩賜箱根公園にたどり着きます。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("恩賜箱根公園: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
