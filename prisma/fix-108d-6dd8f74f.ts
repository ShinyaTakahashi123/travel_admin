/**
 * #108 6dd8f74fの直し(4回目)。fix-108cの直し漏れ2点(flow-check.cjsで発覚):
 * ① 高崎市美術館の書き出しに「この旅の締めくくり」が残っていた(最後の
 *    スポットがタワー美術館に変わったのに直し忘れていた)。あわせて
 *    「あわせて」が2回続く言い回しも直した。
 * ② 高崎市タワー美術館の結びの「帰路につきましょう」が、flow-check.cjsの
 *    帰りの一言の判定(「帰り」「駅へ」「駅まで」など)に一致しない言い回し
 *    だったため、「高崎駅まで戻り、レンタカーを返却してから帰りましょう」
 *    に直した。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const BIJUTSUKAN_FROM = "高崎公園から歩いておよそ8分、この旅の締めくくり、高崎市美術館に着きます。";
const BIJUTSUKAN_TO = "高崎公園から歩いておよそ8分、高崎市美術館に着きます。";
const BIJUTSUKAN_FROM2 = "美術館の展示とあわせて、モダニズム建築の旧邸や庭園もあわせて巡ってみましょう。";
const BIJUTSUKAN_TO2 = "美術館の展示とあわせて、モダニズム建築の旧邸や庭園も巡ってみましょう。";

const TOWER_FROM = "来た道を戻って車に乗り、高崎駅前でレンタカーを返却してから、帰路につきましょう。";
const TOWER_TO = "来た道を戻って車に乗り、高崎駅まで戻り、レンタカーを返却してから帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "高崎市美術館" });
  const tower = await findSpotInItinerary(itinId, { spotName: "高崎市タワー美術館" });

  if (!bijutsukan.memo!.includes(BIJUTSUKAN_FROM)) throw new Error("高崎市美術館の文言①が想定外です");
  if (!bijutsukan.memo!.includes(BIJUTSUKAN_FROM2)) throw new Error("高崎市美術館の文言②が想定外です");
  if (!tower.memo!.includes(TOWER_FROM)) throw new Error("高崎市タワー美術館の文言が想定外です");
  console.log("確認OK: 3件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const bijutsukanMemo = bijutsukan.memo!.replace(BIJUTSUKAN_FROM, BIJUTSUKAN_TO).replace(BIJUTSUKAN_FROM2, BIJUTSUKAN_TO2);
  await updateSpotInItinerary(itinId, { spotId: bijutsukan.id }, { memo: bijutsukanMemo });
  await updateSpotInItinerary(itinId, { spotId: tower.id }, { memo: tower.memo!.replace(TOWER_FROM, TOWER_TO) });
  console.log("COMMITTED: 3件");
}
main().finally(() => prisma.$disconnect());
