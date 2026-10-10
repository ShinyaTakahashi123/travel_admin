/**
 * #37 41e37fe5 flow-checkで見つかった不足(既存の不具合)。南宗寺(D2最後)に
 * 「お帰りは」の一言が欠けていた。最寄りの阪堺電軌阪堺線「御陵前駅」(徒歩5分、
 * じゃらん・大阪府公式観光サイト等で確認)を明記する。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "41e37fe5-383f-47ff-9375-dda356f10a9a";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "南宗寺" });
  const from = "静かに、敬意をもって境内を巡り、2日間の堺めぐりを締めくくってください。";
  const to = "静かに、敬意をもって境内を巡り、2日間の堺めぐりを締めくくってください。お帰りは、阪堺電気軌道阪堺線「御陵前駅」(徒歩5分)からご利用ください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("南宗寺: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
