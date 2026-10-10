/**
 * #67 2fd67b8b（梅田さんぽ）flow-checkで見つかった既存の不足。D1最後の
 * 大阪市中央公会堂に宿への一言がなかったため追加。D2(旅全体)最後の
 * 大阪城天守閣に帰りの一言がなかったため追加。昼食の一言は中崎町・
 * 天神橋筋商店街に既にあるため対応不要。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "大阪市中央公会堂",
    "この重厚な建築を眺めながら、1日目はここで締めくくりです。お疲れさまでした。",
    "この重厚な建築を眺めながら、1日目はここで締めくくりです。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。"
  );
  await replaceMemo(
    "大阪城天守閣",
    "2日間の梅田さんぽ旅も、この壮大な天守閣で無事に終了です。お疲れさまでした。",
    "2日間の梅田さんぽ旅も、この壮大な天守閣で無事に終了です。お疲れさまでした。お帰りは、天守閣から歩いておよそ18分の大阪メトロ「谷町四丁目駅」などをご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
