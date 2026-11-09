/**
 * #100 高山、法務の本番確認(2026-10-30 16:15)の指摘2件。
 * 点・文だけの直しのため、法務のOKで書き込む。
 *
 * 1. 高山市政記念館の座標: OSM node 4414361292(Takayama City Archives Museum)に合わせる
 *    (36.139832,137.259872 → 36.139833,137.259965。約8mのずれ)
 * 2. 「車を運転する人は、試飲もふくめて飲まないでください」(祈りの一文ではないため
 *    「…飲まないようにしましょう」に)。説明文とさんまちのメモの2か所。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-100-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-100-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "581607ca-db3c-489b-8490-50733dcf918d";
const SHISEIKINENKAN_ID = "1e10daba-321b-4547-a60b-ecdf86862848";
const SANMACHI_ID = "f7a1fad1-2801-436d-8ed8-1980825c5668";

const OLD_SENTENCE = "車を運転する人は、試飲もふくめて飲まないでください。";
const NEW_SENTENCE = "車を運転する人は、試飲もふくめて飲まないようにしましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const itinerary = await prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } });
  const sanmachi = await prisma.spot.findFirstOrThrow({ where: { id: SANMACHI_ID } });
  const shiseikinenkan = await prisma.spot.findFirstOrThrow({ where: { id: SHISEIKINENKAN_ID } });

  if (!itinerary.description?.includes(OLD_SENTENCE)) {
    console.log("[想定と違います] 説明文に対象の文が見つかりません。処理を中止します。");
    return;
  }
  if (!sanmachi.memo?.includes(OLD_SENTENCE)) {
    console.log("[想定と違います] さんまちのメモに対象の文が見つかりません。処理を中止します。");
    return;
  }

  const newDescription = itinerary.description.replace(OLD_SENTENCE, NEW_SENTENCE);
  const newSanmachiMemo = sanmachi.memo.replace(OLD_SENTENCE, NEW_SENTENCE);

  console.log("=== #100 法務指摘2件 ===\n");
  console.log("[座標] 高山市政記念館: 36.139833,137.259965 (もと 36.139832,137.259872)\n");
  console.log("[説明文]\n" + newDescription + "\n");
  console.log("[さんまちメモ 末尾100字]\n" + newSanmachiMemo.slice(-100));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: SHISEIKINENKAN_ID }, data: { lat: 36.139833, lng: 137.259965 } }),
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDescription } }),
    prisma.spot.update({ where: { id: SANMACHI_ID }, data: { memo: newSanmachiMemo } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
