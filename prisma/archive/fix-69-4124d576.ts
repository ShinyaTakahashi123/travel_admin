/**
 * #69 4124d576（熊野古道大門坂・那智勝浦・太地）flow-checkで見つかった不足。
 * 太地町立くじらの博物館(単日プラン最後)に帰りの一言がなかったため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "4124d576-4cd8-4086-b61e-9cd8a9576115";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "太地町立くじらの博物館" });
  const from = "補陀洛山寺・大門坂・那智の滝・青岸渡寺・熊野那智大社と巡った、世界遺産の参詣道と那智勝浦・太地の海をめぐる旅も、ここで無事に終了です。お疲れさまでした。";
  const to = "補陀洛山寺・大門坂・那智の滝・青岸渡寺・熊野那智大社と巡った、世界遺産の参詣道と那智勝浦・太地の海をめぐる旅も、ここで無事に終了です。お疲れさまでした。お帰りは、バスなどで紀伊勝浦駅方面へお戻りください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("太地町立くじらの博物館: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
