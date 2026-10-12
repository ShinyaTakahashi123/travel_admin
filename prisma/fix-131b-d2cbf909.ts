/**
 * #131 d2cbf909の直し(2回目、自己点検)。
 * - 奥社のflow-check「途中に結び」誤検知: 「こんぴら参りの締めくくりに
 *   ふさわしい眺めです」の「締めくくり」が、実際の結び文(この後は…)
 *   より前にあり紛らわしかった(#129の開山堂と同じパターン)。
 * - 高灯籠(最終スポット)に帰りの一言がなかったため追加。
 * なお、金陵の郷がprayer-checkで引っかかるのは「陵」の字が日本酒の
 * ブランド名「金陵」に含まれているための誤検知(寺社・墓所ではない)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const OKUSHA_FROM = "たどり着いた先で目にする讃岐平野を見渡す眺めは、こんぴら参りの締めくくりにふさわしい眺めです。";
const OKUSHA_TO = "たどり着いた先で目にする讃岐平野を見渡す眺めは、こんぴら参りを達成した実感を味わえる眺めです。";

const TAKATOURO_FROM = "琴平駅のすぐそばに立っており、こんぴら参りの旅の締めくくりにふさわしい姿を見せてくれます。";
const TAKATOURO_TO = "すぐそばの琴平駅から、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });
  const takatouro = await findSpotInItinerary(itinId, { spotName: "高灯籠" });

  if (!okusha.memo?.includes(OKUSHA_FROM)) throw new Error("奥社の文言が想定外です");
  if (!takatouro.memo?.includes(TAKATOURO_FROM)) throw new Error("高灯籠の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: okusha.id }, { memo: okusha.memo!.replace(OKUSHA_FROM, OKUSHA_TO) });
  await updateSpotInItinerary(itinId, { spotId: takatouro.id }, { memo: takatouro.memo!.replace(TAKATOURO_FROM, TAKATOURO_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
