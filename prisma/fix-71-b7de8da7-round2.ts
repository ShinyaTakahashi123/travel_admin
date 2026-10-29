/**
 * #71(東福寺の通天橋と大原の里。京都の紅葉を満喫する秋の2日間、b7de8da7)の、
 * 企画運営の指示による移動の再測り直しの直し(round2・修正版)。
 *
 * 【重要】最初の round2 は router.project-osrm.org の「歩き」の値(1302m/1292m/941m)
 * を使って3区間を10→17分・10→17分・5→13分に直す予定だったが、法務の指摘で
 * router.project-osrm.org は歩き専用の道のりを持たず車道で計算していることが
 * 判明した。歩きは routing.openstreetmap.de/routed-foot で測り直すべきと確認。
 *
 * 測り直した結果(routing.openstreetmap.de/routed-foot):
 * - 二年坂・産寧坂→清水寺: 782m/約10.4分 → もとの10分のままでよい(直さない)
 * - 八坂神社→青蓮院: 820m/約10.9分 → 10分→約11分に直す(小さな直し)
 * - 三千院→宝泉院: 352m/約4.7分 → もとの5分のままでよい(直さない)
 *
 * このため、このスクリプトは八坂神社→青蓮院の1分だけを直す(ほかは本番未反映
 * のまま変更不要)。Day1の終了は16:35→16:36で、16:30〜17:00の範囲内。
 * 滞在は変えていない(延ばしていない)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-71-b7de8da7-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-71-b7de8da7-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const YASAKA_ID = "3a26b37c-e052-4878-9830-dc5c7b99370c";
const SHOREN_ID = "6bd0f9b8-f12a-4f59-9927-54d40ac2e9aa";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHOREN_FIND = "八坂神社から円山公園を通って歩いて約10分。";
const SHOREN_REPLACE = "八坂神社から円山公園を通って歩いて約11分。";

async function main() {
  const commit = process.argv.includes("--commit");

  const shoren = await prisma.spot.findFirstOrThrow({ where: { id: SHOREN_ID } });

  if (!shoren.memo?.includes(SHOREN_FIND)) {
    console.log(`[想定と違います] 青蓮院に「${SHOREN_FIND}」が見つかりません。処理を中止します。`);
    return;
  }

  const newShorenMemo = shoren.memo!.replace(SHOREN_FIND, SHOREN_REPLACE);

  console.log("=== #71 round2(修正版): 八坂神社→青蓮院の小さな直しのみ ===\n");
  console.log(`[八坂神社] 変更なし(visitTime=15:30, stay=25)`);
  console.log(`[青蓮院] 新visitTime: 16:06  新stay: 30(無変更、〜16:36)  新leg: walk/11分`);
  console.log("  新memo:", newShorenMemo);
  console.log(
    "\nDay1 新しい時刻: 東福寺〜清水寺(無変更)→八坂神社15:30(25)→青蓮院16:06(30、〜16:36)"
  );
  console.log("\nDay2: 変更なし(三千院→宝泉院は5分のまま、寂光院・詩仙堂丈山寺の滞在も無変更)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: SHOREN_ID },
    data: {
      visitTime: T(16, 6),
      memo: newShorenMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
    },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
