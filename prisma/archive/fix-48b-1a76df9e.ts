/**
 * #48 1a76df9e（水木しげるロード・境港、単日プラン）flow-checkで見つかった
 * 既存の不足。昼食の一言が一つもなかったため大漁市場なかうら(13:46〜15:11、
 * 隣接の食事処に既存の言及あり)に追加。最後の弓ヶ浜(単日プラン)に帰りの
 * 一言が欠けていたため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1a76df9e-e99a-47e0-bbe8-fb01fbe2365b";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "大漁市場なかうら",
    "境港で水揚げされた新鮮な魚介がずらりと並び、隣接する食事処では、海の幸を使った料理を味わうこともできます。",
    "境港で水揚げされた新鮮な魚介がずらりと並び、隣接する食事処では、海の幸を使った料理を味わうこともできます。ここで昼食にするのもおすすめです。"
  );
  await replaceMemo(
    "弓ヶ浜",
    "波音を聞きながら、境港をめぐる今日の旅を締めくくってください。",
    "波音を聞きながら、境港をめぐる今日の旅を締めくくってください。お帰りは、駐車場に置いた車でご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
