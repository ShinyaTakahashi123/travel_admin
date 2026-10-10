/**
 * #47 0928e88e（赤木城跡・丸山千枚田）企画運営の指摘。木津呂展望スポット(D1-6、
 * 最後は入鹿温泉ホテル瀞流荘)の「瀞流荘へ向かい、今日の旅を締めくくりましょう」
 * (宿の名前・締めくくりの先取り)を、普通のつながりの文に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "0928e88e-380c-4702-9559-af6252822245";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "木津呂展望スポット" });
  const from = "この後は、山を下りて入鹿温泉ホテル瀞流荘へ向かい、今日の旅を締めくくりましょう。";
  const to = "この後は、山を下りて今夜の宿へ向かいましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("木津呂展望スポット: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
