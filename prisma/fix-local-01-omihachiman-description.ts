/**
 * 近江八幡(承認待ち、c11e9dff)の説明文に残っていた「ラコリーナ近江八幡」を直す。
 * 行き先をラコリーナ近江八幡→西の湖の水郷めぐりに置きかえた際、説明文の直しが
 * 直しのスクリプトに入っていなかった(法務の指摘、2026-11-02)。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "c11e9dff-0397-486c-b42e-49c3d3b6924c";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  console.log(`\n[説明文]\n旧: ${itin.description}`);

  const NEW_DESCRIPTION = itin.description?.replace(
    /八幡山ロープウェーや旧八幡郵便局、ラコリーナ近江八幡もあわせて訪ねます。/,
    "八幡山ロープウェーや旧八幡郵便局、西の湖の水郷めぐりもあわせて訪ねます。"
  );

  if (!itin.description || itin.description === NEW_DESCRIPTION) {
    throw new Error("説明文に対象の文が見つかりません(現在値が期待と不一致)");
  }
  console.log(`新: ${NEW_DESCRIPTION}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
