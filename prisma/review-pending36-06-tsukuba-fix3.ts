/**
 * #6の直し。企画運営の指摘(2026-10-13)に対応。
 * つくばエキスポセンターのメモが「科学館です。」の一言だけで始まり読みにくいため、
 * 前に場所の説明を足す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const expo = await prisma.spot.findFirst({
    where: { name: "つくばエキスポセンター", dayId: "acfb0013-d6f7-4cdf-8bfc-1125d8a6539f" },
  });
  if (!expo?.memo) throw new Error("想定と違います");
  const newMemo = expo.memo.replace("科学館です。", "つくば駅から歩いてすぐの科学館です。");
  if (newMemo === expo.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] つくばエキスポセンターのメモの冒頭に場所の説明を足す");
  console.log("新メモ:", newMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: expo.id }, data: { memo: newMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
