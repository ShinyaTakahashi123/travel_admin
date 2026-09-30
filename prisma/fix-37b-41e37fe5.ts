/**
 * #37 41e37fe5 flow-checkで見つかった不足。1日目はアウトレット差し替えで昼食の一言が
 * 消えていた(自分の編集による)。2日目はもともと昼食の一言がなかった(既存の不具合)。
 * 二色の浜公園(D1、12:35〜13:33)・堺伝統産業会館(D2、13:34〜14:15)に、店名を出さない
 * 昼食の一言を追加する。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "41e37fe5-383f-47ff-9375-dda356f10a9a";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "二色の浜公園",
    "長い年月を経た今も、大阪府内有数の松林と砂浜が残る貴重な景勝地です。",
    "長い年月を経た今も、大阪府内有数の松林と砂浜が残る貴重な景勝地です。公園の周辺には食事処もあるので、ここで昼食にしましょう。"
  );
  await replaceMemo(
    "堺伝統産業会館",
    "職人の手仕事を間近で見学できるコーナーもあり、堺が古くから「ものづくりの町」として栄えてきた理由を肌で感じられます。",
    "職人の手仕事を間近で見学できるコーナーもあり、堺が古くから「ものづくりの町」として栄えてきた理由を肌で感じられます。会館の周辺には食事処もあるので、ここで昼食にしましょう。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
