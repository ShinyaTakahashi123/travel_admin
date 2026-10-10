/**
 * チェックリスト #278 の修正記録(3巡目、企画運営の指摘1点)。
 * しおり「温泉津温泉、世界遺産の湯治場を楽しむ石見銀山1泊2日」
 * (34e2b41c-5c39-43ef-917d-aa859b7a4f16)
 *
 * 豊栄神社の「『洞春』は元就の法号で、元就は生前『洞春公』とも呼ばれていました」の
 * 「生前」は誤りのおそれがあるとの指摘。法号(戒名)は通常、亡くなったあとに付く名前
 * のため、「生前〜呼ばれていました」を削除し、「『洞春』は元就の法号(亡くなった
 * あとの名)です。」に修正。
 *
 * itinerary-audit.cjs 再確認済み(時刻に影響なし)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-278c-34e2b41c.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "34e2b41c-5c39-43ef-917d-aa859b7a4f16";

async function main() {
  const toyosaka = await findSpotInItinerary(ITIN_ID, { spotName: "豊栄神社" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: toyosaka.id } });
  if (row.memo?.includes("生前「洞春公」とも呼ばれていました。")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: toyosaka.id },
      {
        memo: row.memo.replace(
          "「洞春」は元就の法号で、元就は生前「洞春公」とも呼ばれていました。",
          "「洞春」は元就の法号(亡くなったあとの名)です。"
        ),
      }
    );
  }
  console.log("done");
}
main().finally(() => prisma.$disconnect());
