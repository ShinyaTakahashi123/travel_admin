/**
 * #67 2fd67b8b。fix-67dで大阪市立東洋陶磁美術館をD1最後に追加したため、
 * 大阪市中央公会堂(もう最後ではない)に残っていた「1日目はここで締めくくりです。
 * 今夜はこの近くの宿でゆっくり休みましょう」を通常のつながりの文に直し、
 * 新しい最後の東洋陶磁美術館に宿への一言を追加する。
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
    "この重厚な建築を眺めながら、1日目はここで締めくくりです。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。",
    "この重厚な建築を眺めながら、しばし歴史に思いを馳せてみてください。この後は、歩いておよそ5分、大阪市立東洋陶磁美術館へ向かいましょう。"
  );
  await replaceMemo(
    "大阪市立東洋陶磁美術館",
    "静けさに包まれた展示室で、東洋陶磁の美をじっくりと味わってみてください。",
    "静けさに包まれた展示室で、東洋陶磁の美をじっくりと味わってみてください。中之島の建築めぐりも、1日目はここで締めくくりです。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
