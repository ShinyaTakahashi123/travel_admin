/**
 * #63 1621a020（五箇山・白川郷）flow-checkで見つかった2点を直す。
 * 1) 五箇山和紙の里の書き出しが「白山宮から」のままだったが、並べ替え後の
 *    実際の一つ前は羽馬家住宅。
 * 2) 野外博物館合掌造り民家園(Day2最後)に帰りの一言がなかった。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1621a020-b8f3-41ff-bb67-270b99f0782d";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "五箇山和紙の里",
    "白山宮から車でおよそ10分、五箇山和紙の里に着きます。",
    "羽馬家住宅から車でおよそ10分、五箇山和紙の里に着きます。"
  );
  await replaceMemo(
    "野外博物館合掌造り民家園",
    "相倉・菅沼の集落から白川郷まで、五箇山と白川郷の合掌造りをめぐった1泊2日の旅を、ここで締めくくりましょう。",
    "相倉・菅沼の集落から白川郷まで、五箇山と白川郷の合掌造りをめぐった1泊2日の旅を、ここで締めくくりましょう。お帰りは、白川郷ICから高速道路をご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
