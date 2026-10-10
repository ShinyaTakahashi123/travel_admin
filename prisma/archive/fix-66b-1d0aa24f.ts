/**
 * #66 1d0aa24f。itinerary-audit・flow-checkで見つかった3点。
 * 1) 「入園は無料で」が料金の記載にあたるため削除。
 * 2) 清津峡→美人林は直通のバス路線がなく(調べた限り、美人林へはほくほく線+
 *    タクシー、または別路線バス+徒歩20分が実際のアクセス)、車での移動が現実的
 *    なため、レンタカーなどへの切り替えを一言添える。
 * 3) 美人林(単日プラン最後)に帰りの一言がなかったため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1d0aa24f-a0e8-4319-b97b-86952764c785";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "清津峡渓谷トンネル",
    "この後は、車でおよそ25分、美人林へ向かいましょう。",
    "美人林へは直通のバス路線がないため、この後はレンタカーなどで、およそ25分の美人林へ向かいましょう。"
  );
  await replaceMemo(
    "美人林",
    "入園は無料で、木道や遊歩道が整備されています。",
    "木道や遊歩道が整備されています。"
  );
  await replaceMemo(
    "美人林",
    "ロープウェイからの絶景、名作の舞台となった温泉街、日本三大峡谷、そしてブナ林の散策まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。",
    "ロープウェイからの絶景、名作の舞台となった温泉街、日本三大峡谷、そしてブナ林の散策まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。お帰りは、レンタカーなどをご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
