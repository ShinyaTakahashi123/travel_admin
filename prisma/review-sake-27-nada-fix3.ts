/**
 * #27の直し。企画運営の指摘(2026-10-13)に対応。
 * 沢の鶴資料館の「全国初」は公式で確かめられなかったため、部分ごと削除し、
 * 神戸市の公式ページで確認できた範囲の表現に直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const sawanotsuru = await prisma.spot.findFirst({ where: { name: "沢の鶴資料館" } });
  if (!sawanotsuru?.memo) throw new Error("想定と違います");

  const newMemo = sawanotsuru.memo.replace(
    "文化財指定を維持するため、もとの木材を使って再建され、木造建築物としては全国で初めてとされる免震システムが採用されています。",
    "文化財指定を維持するため、もとの木材を使い、免震の仕組みを取り入れて再建されました。"
  );
  if (newMemo === sawanotsuru.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 沢の鶴資料館の「全国初」を削除");
  console.log("新メモ:", newMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: sawanotsuru.id }, data: { memo: newMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
