/**
 * #67 2fd67b8b（梅田さんぽ）flow-checkで見つかった既存の不具合(自分の編集とは
 * 無関係)。梅田スカイビル(D1-6、最後は大阪市中央公会堂)と天神橋筋商店街
 * (D2-4、最後は大阪城天守閣)の書き出しに、それぞれ途中なのに「締めくくり」と
 * いう言葉が残っていたため、通常の書き出しに修正。
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
    "梅田スカイビル",
    "梅田さんぽの締めくくりは、独特なフォルムが目を引く梅田スカイビルです。",
    "グラングリーン大阪から歩いておよそ5分、独特なフォルムが目を引く梅田スカイビルに着きます。"
  );
  await replaceMemo(
    "天神橋筋商店街",
    "大阪天満宮から歩いてすぐ、今回の締めくくりは、天神橋一丁目から七丁目まで、全長約2.6kmにわたって続く天神橋筋商店街です。",
    "大阪天満宮から歩いてすぐ、天神橋一丁目から七丁目まで、全長約2.6kmにわたって続く天神橋筋商店街に着きます。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
