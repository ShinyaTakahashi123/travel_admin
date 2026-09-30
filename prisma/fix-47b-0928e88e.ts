/**
 * #47 0928e88e（赤木城跡・丸山千枚田、単日プラン）flow-checkで見つかった
 * 既存の不足。昼食の一言が一つもなかったため紀州鉱山資料館(12:50〜13:20)に
 * 追加。最後の入鹿温泉ホテル瀞流荘(単日プランのため宿泊ではなく日帰り利用)に
 * 帰りの一言が欠けていたため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "0928e88e-380c-4702-9559-af6252822245";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "紀州鉱山資料館",
    "昭和53年(1978年)の閉山まで長く続いたこの鉱山の歩みを、採掘現場を再現した展示や、坑道を下りていく体験ができるエレベーターなどで紹介しています。",
    "昭和53年(1978年)の閉山まで長く続いたこの鉱山の歩みを、採掘現場を再現した展示や、坑道を下りていく体験ができるエレベーターなどで紹介しています。周辺には食事処もあるので、ここで昼食にしましょう。"
  );
  await replaceMemo(
    "入鹿温泉ホテル瀞流荘",
    "山里をめぐる今日の旅の締めくくりにふさわしい眺めです。",
    "山里をめぐる今日の旅の締めくくりにふさわしい眺めです。お帰りは、駐車場に置いた車でご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
