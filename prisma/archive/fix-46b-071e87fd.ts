/**
 * #46 071e87fd（嵐山・嵯峨野）flow-checkで見つかった既存の不足(自分の編集とは無関係)。
 * 3日間とも昼食の一言が一つもなく、D1・D2の最後に宿への一言、D3(旅全体)の最後の
 * 滝口寺に帰りの一言が欠けていた。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "071e87fd-03f9-4cdd-a3b5-170c62e6a807";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  // D1 昼食: 法輪寺(嵯峨)、D1最後の大覚寺に宿の一言
  await replaceMemo(
    "法輪寺（嵯峨）",
    "静かに、敬意をもってお参りください。この後は、野生のニホンザルが暮らす嵐山モンキーパークへ向かいましょう。",
    "静かに、敬意をもってお参りください。参道周辺には食事処もあるので、ここで昼食にしましょう。この後は、野生のニホンザルが暮らす嵐山モンキーパークへ向かいましょう。"
  );
  await replaceMemo(
    "大覚寺",
    "静かに、敬意をもってお過ごしください。1日目はここで締めくくりましょう。",
    "静かに、敬意をもってお過ごしください。1日目はここで締めくくりましょう。今夜はこの近くの宿でゆっくり休みましょう。"
  );

  // D2 昼食: 天龍寺、D2最後の嵯峨鳥居本の町並みに宿の一言
  await replaceMemo(
    "天龍寺",
    "静かに、敬意をもってお参りください。この後は、すぐそばの塔頭・宝厳院へ向かいましょう。",
    "静かに、敬意をもってお参りください。周辺には食事処もあるので、ここで昼食にしましょう。この後は、すぐそばの塔頭・宝厳院へ向かいましょう。"
  );
  await replaceMemo(
    "嵯峨鳥居本の町並み",
    "静かな坂道をのんびり歩きながら、2日目の締めくくりに嵯峨野の昔ながらの風情を味わいましょう。",
    "静かな坂道をのんびり歩きながら、2日目の締めくくりに嵯峨野の昔ながらの風情を味わいましょう。今夜はこの近くの宿でゆっくり休みましょう。"
  );

  // D3 昼食: 常寂光寺
  await replaceMemo(
    "常寂光寺",
    "石段をゆっくり上りながら、歌に詠まれた小倉山の風情を味わってみてください。静かに、敬意をもってお過ごしください。",
    "石段をゆっくり上りながら、歌に詠まれた小倉山の風情を味わってみてください。周辺には食事処もあるので、ここで昼食にしましょう。静かに、敬意をもってお過ごしください。"
  );

  // D3最後(旅全体の最後)の滝口寺に帰りの一言
  await replaceMemo(
    "滝口寺",
    "滝口入道と横笛の悲恋に思いを馳せながら、2泊3日の嵐山・嵯峨野の旅を締めくくってください。",
    "滝口入道と横笛の悲恋に思いを馳せながら、2泊3日の嵐山・嵯峨野の旅を締めくくってください。お帰りは、JR嵯峨嵐山駅(徒歩およそ20分)、または京都バス「嵯峨釈迦堂前」バス停(徒歩15分)からご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
