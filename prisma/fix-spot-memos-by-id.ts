import fs from "fs";
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const file = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "prisma/_kyoto-factcheck-fixes.json";
const fixes: Record<string, string> = JSON.parse(fs.readFileSync(file, "utf8"));

function len(s: string) {
  return [...s].length;
}

async function main() {
  const ids = Object.keys(fixes);
  let under150 = 0;
  for (const id of ids) {
    const spot = await prisma.spot.findUnique({ where: { id }, select: { name: true, memo: true } });
    if (!spot) {
      console.log(`!! NOT FOUND: ${id}`);
      continue;
    }
    const newMemo = fixes[id];
    console.log(`\n[${spot.name}] id=${id}`);
    console.log(`  旧(${len(spot.memo || "")}字): ${spot.memo}`);
    console.log(`  新(${len(newMemo)}字): ${newMemo}`);
    if (len(newMemo) < 150) {
      under150++;
      console.log(`  !! 150字未満`);
    }
    if (commit) {
      await prisma.spot.updateMany({ where: { id }, data: { memo: newMemo } });
    }
  }
  console.log(`\n合計: ${ids.length}件${commit ? "（--commitで反映済み）" : "（確認モード。反映するには --commit を付けて再実行）"}`);
  console.log(`150字未満: ${under150}件`);
  await prisma.$disconnect();
}
main();
