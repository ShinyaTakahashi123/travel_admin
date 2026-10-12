/**
 * #330の続き。法務2026-10-01 04:39の指摘: 高千穂神社の結びが「車でおよそ15分の
 * 高千穂町歴史民俗資料館へ」のままだった(fix-330eで移動時間を15分→5分に
 * 戻した際の見落とし、自己チェック)。資料館の書き出し(5分)に合わせて修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-330f-8ddcabc5.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8ddcabc5-91a8-49bb-881a-d60a4d29dc93";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "高千穂神社", day: { itineraryId: ITIN_ID } } });
  const old = "続いては、車でおよそ15分の高千穂町歴史民俗資料館へ向かいましょう。";
  const next = "続いては、車でおよそ5分の高千穂町歴史民俗資料館へ向かいましょう。";
  if (spot.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!spot.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
