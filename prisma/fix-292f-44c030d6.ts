/**
 * チェックリスト #292 の修正記録(見直しの続き5、flow-check.cjsのセルフチェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 2つの書き出しの取りこぼしを発見・修正:
 * 1. うつぼ沼・目玉沼: 本文は「片貝沼からは…15分ほど」のままだったが、実際の
 *    移動時間はfix-292dで5分に修正済み。本文を5分に修正。
 * 2. 上湯・川原湯共同浴場: 本文が「片貝沼からは…30分ほど」のまま残っていた
 *    (fix-292cでの置き換えが、fix-292で先に書き換わっていた文言と一致せず
 *    不発になっていた)。実際の直前のスポットであるうつぼ沼・目玉沼からの
 *    移動(25分)に修正。
 *
 * flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292f-44c030d6.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const utsubo = await findSpotInItinerary(ITIN_ID, { spotName: "うつぼ沼・目玉沼" });
  const utsuboRow = await prisma.spot.findUniqueOrThrow({ where: { id: utsubo.id } });
  if (utsuboRow.memo?.includes("15分ほどです。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: utsubo.id }, {
      memo: utsuboRow.memo.replace(
        "片貝沼からは、リフトと徒歩をあわせて15分ほどです。",
        "片貝沼からは、リフトと徒歩をあわせて5分ほどです。"
      ),
    });
  }

  const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
  const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
  if (kyodoRow.memo?.startsWith("片貝沼からは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, {
      memo: kyodoRow.memo.replace(
        "片貝沼からは、リフトと徒歩をあわせて30分ほどです。",
        "うつぼ沼・目玉沼からは、リフトと徒歩をあわせて25分ほどです。"
      ),
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
