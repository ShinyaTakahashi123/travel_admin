/**
 * チェックリスト #297 の修正記録(見直しの続き、法務の指摘)。
 * しおり「日光東照宮と輪王寺、二荒山神社をめぐり御朱印をいただく日帰りプラン」
 * (4bc90090-102a-4b9d-bae8-31abe8f12f23)
 *
 * 滝尾神社の「子宝・安産にご利益があるという『子種石』」は、体のこと(妊娠・
 * 出産)にかかわるご利益を言う形だったため、「子宝や安産を願う人がお参りする
 * 『子種石』」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-297c-4bc90090.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "4bc90090-102a-4b9d-bae8-31abe8f12f23";

async function main() {
  const takinoo = await findSpotInItinerary(ITIN_ID, { spotName: "滝尾神社" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: takinoo.id } });
  const oldText = "子宝・安産にご利益があるという「子種石」";
  if (row.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: takinoo.id }, {
      memo: row.memo.replace(oldText, "子宝や安産を願う人がお参りする「子種石」"),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
