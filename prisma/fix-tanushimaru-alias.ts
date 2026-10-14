/**
 * 田主丸大塚古墳の別名「田主丸ワインの森」を削除(企画運営2026-10-14指摘、
 * ワイナリーのスポットを差し替えた名残の誤った別名)。
 */
import { prisma } from "../src/lib/prisma";
const COMMIT = process.argv.includes("--commit");
const ALIAS_ID = "c7320fda-5bd0-4789-a376-28a98b27df76";

async function main() {
  const alias = await prisma.placeMasterAlias.findUnique({ where: { id: ALIAS_ID }, include: { placeMaster: { select: { name: true } } } });
  if (!alias || alias.alias !== "田主丸ワインの森" || alias.placeMaster.name !== "田主丸大塚古墳(大塚古墳歴史公園)") {
    throw new Error("想定と違います");
  }
  console.log("[確認OK] 削除対象:", alias.placeMaster.name, "の別名「" + alias.alias + "」");
  if (!COMMIT) return console.log("\n確認モードです。--commit で削除します。");
  await prisma.placeMasterAlias.delete({ where: { id: ALIAS_ID } });
  console.log("  COMMITTED(削除しました)");
}
main().finally(() => prisma.$disconnect());
