/**
 * #71(東福寺の通天橋と大原の里。京都の紅葉を満喫する秋の2日間、b7de8da7)の
 * 初日を、docs/content/itinerary-rules.md(10/29仕様)に合わせて組み直す。
 * 最終日(Day2)は09:30開始・7か所・16:50終了で、1泊2日の決まり
 * (16:30-17:00・4か所以上)にすでに合うため変更しない。
 *
 * 【Day1(初日、11時ごろ〜・3か所以上・16:30〜17:00）】
 * 直す前は09:00開始・7か所、16:45終了(終了は決まりの範囲内)。タイトル・
 * 説明文にある見どころ(東福寺・泉涌寺・高台寺・二年坂・産寧坂・清水寺・
 * 八坂神社・青蓮院)は、7か所すべてが説明文にある見どころなので、1つも
 * 外さず、開始を10:50に遅らせた分、各スポットの滞在をバランスよく短くした
 * (移動時間は変えていない)。1か所目に入口の一文(京都駅に10時30分ごろ着)を
 * 追加(10:30は決まりの最も早い時刻)。
 *
 * 新しい時刻(Day1、10:50〜16:35、7か所): 東福寺10:50(45)→泉涌寺11:50(30)
 * →高台寺12:35(40)→二年坂・産寧坂13:25(40、昼食)→清水寺14:15(50)→
 * 八坂神社15:30(25)→青蓮院16:05(30)
 *
 * 【言葉づかい】Day1・Day2とも確認したが、「〜てみてください」「おすすめ」
 * 「ください」(祈りの一文以外)は見つからなかった(もとから「お参りしましょう」
 * の形を使っている)。直す点なし。
 *
 * 【座標(7章、けたの少ない点の確認)】
 * 全14か所を確認し、青蓮院(35.007602/135.7834、経度が4けた)のみ該当。
 * Nominatim(way456124860「青蓮院」)の35.0076015/135.7833999で確かめると
 * 実質同じ値(精度のみ低い)だったため、精度を上げる形で直す。ほかの
 * けたの少ない点(二年坂・実光院・寂光院・詩仙堂など5けたの点)は、
 * 4けた以下の厳密な対象ではないため見送った。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-71-b7de8da7.ts
 *   反映: npm run prod -- npx tsx prisma/fix-71-b7de8da7.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "c91f1850-79bc-4082-88f2-85f748e31e79";

const TOFUKUJI_ID = "d37ab3cb-a5c4-4e10-b582-5bb2581380d3"; // 東福寺
const SENNYUJI_ID = "88224fc5-e935-4f94-84b1-47d624e9a444"; // 泉涌寺
const KODAIJI_ID = "400e6e9c-dc89-4e5d-bc7d-9c6e2c48064a"; // 高台寺
const NINENZAKA_ID = "d80bc311-87c8-4209-9c37-5955f7b8a502"; // 二年坂・産寧坂
const KIYOMIZU_ID = "e7df49bc-08c9-4f2a-a341-70c805677373"; // 清水寺
const YASAKA_ID = "3a26b37c-e052-4878-9830-dc5c7b99370c"; // 八坂神社
const SHOREN_ID = "6bd0f9b8-f12a-4f59-9927-54d40ac2e9aa"; // 青蓮院

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TOFUKUJI_FIND = "京都駅からJR奈良線で1駅の東福寺駅へ行き、歩いて約10分。";
const TOFUKUJI_REPLACE = "京都駅に10時30分ごろ着いたら、JR奈良線で1駅の東福寺駅へ行き、歩いて約10分。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [tofukuji, sennyuji, kodaiji, ninenzaka, kiyomizu, yasaka, shoren] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TOFUKUJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SENNYUJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KODAIJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NINENZAKA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KIYOMIZU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YASAKA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHOREN_ID, dayId: DAY1_ID } }),
  ]);

  if (!tofukuji.memo?.includes(TOFUKUJI_FIND)) {
    console.log(`[想定と違います] 東福寺に「${TOFUKUJI_FIND}」が見つかりません。処理を中止します。`);
    return;
  }

  const newTofukujiMemo = tofukuji.memo!.replace(TOFUKUJI_FIND, TOFUKUJI_REPLACE);

  console.log("=== #71 Day1(初日)直す前→直した後 ===\n");
  console.log(`[1] 東福寺 (id=${tofukuji.id})  新visitTime: 10:50  新stay: 45`);
  console.log("  新memo:", newTofukujiMemo);
  console.log(`[2] 泉涌寺 (id=${sennyuji.id}) — 本文無修正  新visitTime: 11:50  新stay: 30`);
  console.log(`[3] 高台寺 (id=${kodaiji.id}) — 本文無修正  新visitTime: 12:35  新stay: 40`);
  console.log(`[4] 二年坂・産寧坂 (id=${ninenzaka.id}) — 本文無修正  新visitTime: 13:25  新stay: 40(昼食)`);
  console.log(`[5] 清水寺 (id=${kiyomizu.id}) — 本文無修正  新visitTime: 14:15  新stay: 50`);
  console.log(`[6] 八坂神社 (id=${yasaka.id}) — 本文無修正  新visitTime: 15:30  新stay: 25`);
  console.log(`[7] 青蓮院 (id=${shoren.id}) — 本文無修正、座標の精度のみ  新visitTime: 16:05  新stay: 30(〜16:35)`);
  console.log("  旧lat/lng:", shoren.lat, shoren.lng, " → 新lat/lng: 35.0076015 / 135.7833999 (OSM Nominatim way456124860「青蓮院」)");
  console.log("\nDay1 新しい時刻: 東福寺10:50(45)→泉涌寺11:50(30)→高台寺12:35(40)→二年坂・産寧坂13:25(40、昼食)→清水寺14:15(50)→八坂神社15:30(25)→青蓮院16:05(30、〜16:35)");
  console.log("\nDay2(最終日)は09:30開始・7か所・16:50終了で決まりに合うため変更なし。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: tofukuji.id, data: { visitTime: T(10, 50), stayDurationMin: 45, memo: newTofukujiMemo } },
    { id: sennyuji.id, data: { visitTime: T(11, 50), stayDurationMin: 30 } },
    { id: kodaiji.id, data: { visitTime: T(12, 35), stayDurationMin: 40 } },
    { id: ninenzaka.id, data: { visitTime: T(13, 25), stayDurationMin: 40 } },
    { id: kiyomizu.id, data: { visitTime: T(14, 15), stayDurationMin: 50 } },
    { id: yasaka.id, data: { visitTime: T(15, 30), stayDurationMin: 25 } },
    { id: shoren.id, data: { visitTime: T(16, 5), stayDurationMin: 30, lat: 35.0076015, lng: 135.7833999 } },
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
