/**
 * #67 2fd67b8b（梅田さんぽ）企画運営の指摘で#66〜82の一括作業のうち先に対応。
 * 読み直して見つけた既存の不具合: 茶屋町の結びが「次はグラングリーン大阪へ」に
 * なっていたが、実際の次のスポットは中崎町(中崎町側の書き出しも「茶屋町から」と
 * 一致)。中崎町を追加した際、茶屋町の結びが更新されないまま残っていたとみられる。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "茶屋町" });
  const from = "街を歩きながら、そんな地名の由来に思いを馳せてみるのも面白いですね。散策を終えたら、次は大きな公園が広がるグラングリーン大阪へ向かいましょう。";
  const to = "街を歩きながら、そんな地名の由来に思いを馳せてみるのも面白いですね。散策を終えたら、次は歩いておよそ6分、中崎町へ向かいましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("茶屋町: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
