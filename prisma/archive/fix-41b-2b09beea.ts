/**
 * #41 2b09beea（那覇）flow-checkで見つかった既存の不足(自分の編集とは無関係)。
 * D1に昼食の一言なし→奥武山公園に追加。D1最後の福州園に宿への一言なし→追加。
 * D2に昼食の一言なし→国際通り(食べ歩きの記述を昼食に明確化)。D2最後(旅全体の最後)の
 * 首里城公園にお帰りの一言なし→ゆいレール首里駅・バス停(公式サイトで確認)を追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "2b09beea-4deb-45cc-bae3-41ba5f80df2c";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "奥武山公園",
    "さらに沖宮、護国神社もあり、園内で複数の神社にお参りできるのも珍しい特徴です。",
    "さらに沖宮、護国神社もあり、園内で複数の神社にお参りできるのも珍しい特徴です。公園の周辺には食事処もあるので、ここで昼食にしましょう。"
  );
  await replaceMemo(
    "福州園",
    "夜にはライトアップされることもあり、久米の歴史に思いを馳せながら、1日目の旅を締めくくってください。",
    "夜にはライトアップされることもあり、久米の歴史に思いを馳せながら、1日目の旅を締めくくってください。今夜はこの近くの宿でゆっくり休みましょう。"
  );
  await replaceMemo(
    "国際通り",
    "歴史散策の合間に、お土産探しや食べ歩きでひと息つくのにぴったりの場所です。",
    "歴史散策の合間に、お土産探しや食べ歩きで、ここを昼食にするのもおすすめです。"
  );
  await replaceMemo(
    "首里城公園",
    "琉球王国の歴史に思いを馳せながら、1泊2日の那覇の旅を締めくくってください。",
    "琉球王国の歴史に思いを馳せながら、1泊2日の那覇の旅を締めくくってください。お帰りは、ゆいレール首里駅(徒歩15分)、または首里城下町線バス「首里城前」バス停(徒歩1分)からご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
