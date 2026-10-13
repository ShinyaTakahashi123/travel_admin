/**
 * #33の直し(企画運営の指摘、2026-10-13)。旧光本家住宅は休館日が多い(火水木)が、
 * 曜日は書かない決まりのため、開館日を確かめる旨の一文を追加する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const NOTE = "休館日が多いため、訪れる前に公式の案内で開館日を確かめましょう。";

async function main() {
  const spot = await prisma.spot.findFirst({ where: { name: "旧光本家住宅" } });
  if (!spot?.memo) throw new Error("想定と違います");
  if (spot.memo.includes(NOTE)) throw new Error("既に一文があります(想定外)");

  const newMemo = spot.memo + NOTE;
  console.log("[確認OK] 旧光本家住宅に休館日の注意を追加");
  console.log("新メモ:", newMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: spot.id }, data: { memo: newMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
