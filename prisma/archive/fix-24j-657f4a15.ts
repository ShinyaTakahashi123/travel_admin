/**
 * #24 657f4a15（箱根）法務の指摘(2026-09-30 10:58)。
 * 1) 強羅公園: 「日本で最も古い...です」→「...とされます」(言い切り回避)。
 *    「有料公園として一般に開放され」→「有料」を外す(決まり9: 料金は書かない)。
 * 2) 大涌谷: 火山ガスの安全の一言を追加(予約の一文はそのまま)。
 * 3) 強羅温泉: 「浴場ではほかの入浴客を撮らないようにしましょう」を追加。
 * 4) fix-24gの並べ替え後、杉並木・箱根町港の本文が旧い並びのままだったのを、
 *    今の順番(成川美術館→杉並木、箱根関所は箱根町港のあと)に合わせて修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "強羅公園",
    "大正3年（1914年）に開園した、日本で最も古いフランス式整型庭園です。",
    "大正3年（1914年）に開園した、日本で最も古いフランス式整型庭園とされます。"
  );
  await replaceMemo(
    "強羅公園",
    "戦後の1957年になって有料公園として一般に開放され",
    "戦後の1957年になって一般に開放され"
  );
  await replaceMemo(
    "大涌谷",
    "大涌谷の散策エリアに立ち入る際は、事前にウェブサイトから予約が必要なので、訪れる前に確かめておきましょう。この後は",
    "大涌谷の散策エリアに立ち入る際は、事前にウェブサイトから予約が必要なので、訪れる前に確かめておきましょう。火山ガスが出ているので、ぜんそくや心臓などに持病のある人は気をつけ、立ち入りの規制は公式の案内で確かめましょう。この後は"
  );
  await replaceMemo(
    "強羅温泉",
    "湯につかって明日への英気を養ってください。",
    "湯につかって明日への英気を養ってください。浴場ではほかの入浴客を撮らないようにしましょう。"
  );
  await replaceMemo(
    "箱根旧街道杉並木",
    "箱根関所から歩いておよそ10分、箱根旧街道杉並木に着きます。",
    "成川美術館から歩いておよそ3分、箱根旧街道杉並木に着きます。"
  );
  await replaceMemo(
    "箱根町港",
    "山側から歩いてきた元箱根・箱根関所のあたりを、今度は湖の上から眺めた余韻とともに振り返ることができます。",
    "山側から歩いてきた元箱根のあたりを、今度は湖の上から眺めた余韻とともに振り返ることができます。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
