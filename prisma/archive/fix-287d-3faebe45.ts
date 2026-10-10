/**
 * チェックリスト #287 の修正記録(4巡目、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * fix-287cで追加した地図と測量の科学館の本文に「入館は無料です」と書いたところ、
 * itinerary-audit.cjsで「料金・時刻・日程・先の予定の記載」(決まり9違反)と指摘
 * された。この一文を削除し、この施設の他の本文と同様に「休館日があるので、訪れる
 * 前に公式の案内で確かめましょう。」で締めるよう修正。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287d-3faebe45.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const spot = await findSpotInItinerary(ITIN_ID, { spotName: "地図と測量の科学館" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
  if (row.memo?.includes("入館は無料です。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, {
      memo: row.memo.replace(
        "常設展示室や地球ひろば、地図のギャラリーなど、複数の展示エリアに分かれており、入館は無料です。休館日があるので、訪れる前に公式の案内で確かめましょう。",
        "常設展示室や地球ひろば、地図のギャラリーなど、複数の展示エリアに分かれています。休館日があるので、訪れる前に公式の案内で確かめましょう。"
      ),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
