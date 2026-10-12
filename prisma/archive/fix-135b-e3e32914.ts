/**
 * #135 e3e32914（門司港レトロ）flow-checkで見つかった既存の不足(自分の編集とは無関係)。
 * D1に昼食の一言なし→関門海峡ミュージアムに追加。D1最後の門司港レトロ展望室に
 * 宿への一言なし→追加。D2に昼食の一言なし→海峡プラザ(食事処の記述を昼食に明確化)。
 * D2最後(旅全体の最後)の三宜楼に帰りの一言なし→門司港駅を追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "e3e32914-5c7e-4d4c-94ae-c0c0598cdaf1";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "関門海峡ミュージアム",
    "令和元年(2019)には大規模なリニューアルが行われ、海峡の歴史を伝える展示や、巌流島の戦いを再現した仕掛けなど、大人から子どもまで楽しめる内容が充実しています。",
    "令和元年(2019)には大規模なリニューアルが行われ、海峡の歴史を伝える展示や、巌流島の戦いを再現した仕掛けなど、大人から子どもまで楽しめる内容が充実しています。周辺には食事処もあるので、ここで昼食にしましょう。"
  );
  await replaceMemo(
    "門司港レトロ展望室",
    "旅の締めくくりに、1日かけて巡った関門海峡の全景をゆっくりと眺めてください。",
    "旅の締めくくりに、1日かけて巡った関門海峡の全景をゆっくりと眺めてください。今夜はこの近くの宿でゆっくり休みましょう。"
  );
  await replaceMemo(
    "海峡プラザ",
    "眺めのよいレストランも多いので、休憩にもぴったりです。",
    "眺めのよいレストランも多いので、ここで昼食にするのもおすすめです。"
  );
  await replaceMemo(
    "三宜楼",
    "2日間かけて巡った門司港レトロの建築群を、この百畳間で締めくくってください。",
    "2日間かけて巡った門司港レトロの建築群を、この百畳間で締めくくってください。お帰りは、歩いておよそ10分の門司港駅からご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
