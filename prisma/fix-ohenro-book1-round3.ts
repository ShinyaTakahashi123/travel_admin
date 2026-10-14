/**
 * 本1(#7)3回目の直し(企画運営指摘、2026-10-14)。
 * 大塚国際美術館の「地下3階から地上2階までの5つのフロア」は、公式サイトの
 * フロア案内ページで出典を確かめられなかったため削除する。
 * 対象はidで指定する(今後の決まりどおり)。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book1-round3.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book1-round3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const OTSUKA_ID = "7e403ef9-3c4e-40fb-82cf-3a8c75fcb359";
const OLD_MEMO =
  "世界26カ国の西洋名画を、陶板に焼き付けて原寸大で再現した美術館です。地下3階から地上2階までの5つのフロアに、「モナ・リザ」「最後の晩餐」「ゲルニカ」など、原寸大で再現された名画が並びます。開館日や時間は公式サイトで確かめましょう。";
const NEW_MEMO =
  "世界26カ国の西洋名画を、陶板に焼き付けて原寸大で再現した美術館です。「モナ・リザ」「最後の晩餐」「ゲルニカ」など、原寸大で再現された名画が並びます。開館日や時間は公式サイトで確かめましょう。";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: OTSUKA_ID } });
  if (!spot || spot.memo !== OLD_MEMO) throw new Error("想定と違います");

  console.log("[確認OK] 大塚国際美術館(id指定)のメモから「地下3階から地上2階までの5つのフロア」を削除");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: OTSUKA_ID }, data: { memo: NEW_MEMO } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
