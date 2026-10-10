/**
 * #65 1bd66235（浦富海岸・鳥取）flow-checkで見つかった既存の不具合2点を直す。
 * 1) 岩井ゆかむり温泉(Day1最後)に「宿へ」の一言がなかった。
 * 2) 仁風閣(Day2の途中)に「鳥取砂丘から続く今日の旅を締めくくりましょう」という
 *    古い結びが残っていた(以前は最後のスポットだったとみられる)。次のスポット
 *    (わらべ館の前、鳥取県立博物館の次)への一言に差し替える。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "岩井ゆかむり温泉",
    "山陰最古級の湯につかりながら、浦富海岸から続く今日までの旅をゆっくりと締めくくりましょう。訪れる前に、公式サイトで営業時間や休館日を確かめてください。",
    "山陰最古級の湯につかりながら、浦富海岸から続く今日までの旅をゆっくりと締めくくりましょう。今夜はこの近くの宿へ向かいましょう。訪れる前に、公式サイトで営業時間や休館日を確かめてください。"
  );
  await replaceMemo(
    "仁風閣",
    "鳥取城跡の緑を借景にしたこの洋館で、鳥取砂丘から続く今日の旅を締めくくりましょう。",
    "鳥取城跡の緑を借景にしたこの洋館を、ゆっくりと味わってみてください。この後は、歩いておよそ8分、わらべ館へ向かいましょう。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
