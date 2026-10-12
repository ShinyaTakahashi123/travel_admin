/**
 * #72 55a33667。企画運営の指摘。熱海サンビーチ(D1最初)に、途中から車移動になる
 * ことがわかる一言を追加。旧日向別邸の公開日・予約制の一言は既に入っていたため
 * 対応不要(確認のみ)。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "55a33667-b603-4efa-ad4f-2b5f8e8e2f47";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "熱海サンビーチ" });
  const from = "旅の始まりは熱海サンビーチです。";
  const to = "旅の始まりは熱海サンビーチです。熱海の町なかは歩いてめぐり、来宮神社のあとはレンタカーなどでめぐります。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("熱海サンビーチ: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
