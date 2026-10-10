/**
 * チェックリスト #292 の修正記録(見直しの続き9、flow-check.cjsのセルフチェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * どっこ沼の書き出しが「鳥兜山展望台からは…25分ほど」のまま残っていた。
 * 実際の移動時間はfix-292iで10分に修正済みのため、本文も10分に修正。
 *
 * flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292j-44c030d6.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const dokko = await findSpotInItinerary(ITIN_ID, { spotName: "どっこ沼" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: dokko.id } });
  if (row.memo?.includes("25分ほどです。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: dokko.id }, {
      memo: row.memo.replace(
        "鳥兜山展望台からは、リフトと徒歩をあわせて25分ほどです。",
        "鳥兜山展望台からは、リフトと徒歩をあわせて10分ほどです。"
      ),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
