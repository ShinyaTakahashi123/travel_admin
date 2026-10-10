/**
 * チェックリスト #296 の修正記録(見直しの続き、法務の指摘)。
 * しおり「湯田温泉、白狐伝説の名湯と足湯めぐりの定番日帰りプラン」
 * (4a6a640d-59e8-4365-8deb-915fcf898376)
 *
 * 瑠璃光寺五重塔の「日本三名塔の一つに数えられる」は、日本三景のように
 * 定まった呼び名ではないため、「日本三名塔の一つともいわれる」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-296c-4a6a640d.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "4a6a640d-59e8-4365-8deb-915fcf898376";

async function main() {
  const goju = await findSpotInItinerary(ITIN_ID, { spotName: "瑠璃光寺五重塔" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: goju.id } });
  const oldText = "日本三名塔の一つに数えられる国宝の塔です。";
  if (row.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: goju.id }, {
      memo: row.memo.replace(oldText, "日本三名塔の一つともいわれる国宝の塔です。"),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
