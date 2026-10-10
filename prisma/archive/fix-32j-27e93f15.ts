/**
 * #32 27e93f15 金鱗湖の朝霧と由布院温泉、別府の地獄めぐりへ 冬の湯どころ
 * 1泊2日。企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '27e93f15%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "大杵社",
    "由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終了です。お疲れさまでした。今夜は由布院の宿でゆっくりお休みください。",
    "由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終わりです。今夜は由布院の宿でゆっくりお休みください。",
    "大杵社(口調)"
  );
  await fixOne(
    "龍巻地獄",
    "金鱗湖の朝霧から、狭霧台やアルテジオでの静かなひととき、そして別府の地獄めぐりへと移り変わった2日目も、ここで無事に終了です。お疲れさまでした。帰りは車で別府駅・大分空港方面へ向かい、レンタカーを返却しましょう。",
    "金鱗湖の朝霧から、狭霧台やアルテジオでの静かなひととき、そして別府の地獄めぐりへと移り変わった2日目も、ここで終わりです。帰りは車で別府駅・大分空港方面へ向かい、レンタカーを返却しましょう。",
    "龍巻地獄(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
