/**
 * チェックリスト #296 の修正記録(続き、prayer-check.cjsで発見)。
 * しおり「湯田温泉、白狐伝説の名湯と足湯めぐりの定番日帰りプラン」
 * (4a6a640d-59e8-4365-8deb-915fcf898376)
 *
 * 瑠璃光寺五重塔(寺院の境内)に配慮の一文がなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-296b-4a6a640d.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "4a6a640d-59e8-4365-8deb-915fcf898376";

async function main() {
  const goju = await findSpotInItinerary(ITIN_ID, { spotName: "瑠璃光寺五重塔" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: goju.id } });
  const oldTail = "塔が立つ境内は香山公園として整備され、四季折々の風情も楽しめます。";
  if (row.memo?.includes(oldTail)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: goju.id }, {
      memo: row.memo.replace(
        oldTail,
        oldTail + " 今も法灯を守る寺院の境内なので、静かに、敬意をもって拝観しましょう。"
      ),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
