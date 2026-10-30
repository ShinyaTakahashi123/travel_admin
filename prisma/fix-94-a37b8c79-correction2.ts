/**
 * #94 訂正その2。fix-94-a37b8c79.ts でならまち・元興寺のvisitTimeの計算を誤り、
 * itinerary-audit.tsで2件のずれが出た(ならまち14:53→14:52、元興寺15:29→15:28)。
 * 正しい時刻に直す。あわせて、説明文の「確かめてください」を「確かめましょう」に直す
 * (法務の指摘)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-94-a37b8c79-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-94-a37b8c79-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "a37b8c79-85e0-4c3d-b2c6-94057033f31a";
const NARAMACHI_ID = "210616e9-bcdd-430d-a0d5-92d386ac130a";
const GANGOJI_ID = "f6543e24-be5f-447c-a46f-f08f9321b631";

const DESC_FIND = "お出かけ前に各寺社の公式の案内で確かめてください。";
const DESC_REPLACE = "お出かけ前に各寺社の公式の案内で確かめましょう。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const commit = process.argv.includes("--commit");

  const itinerary = await prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } });
  if (!itinerary.description?.includes(DESC_FIND)) {
    console.log("[想定と違います] 説明文に対象の文が見つかりません。処理を中止します。");
    return;
  }
  const newDescription = itinerary.description.replace(DESC_FIND, DESC_REPLACE);

  console.log("=== #94 訂正その2 ===");
  console.log("ならまち: 14:52に直す");
  console.log("元興寺: 15:28に直す");
  console.log("説明文:", newDescription.slice(-40));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDescription } }),
    prisma.spot.update({ where: { id: NARAMACHI_ID }, data: { visitTime: t(14, 52) } }),
    prisma.spot.update({ where: { id: GANGOJI_ID }, data: { visitTime: t(15, 28) } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
