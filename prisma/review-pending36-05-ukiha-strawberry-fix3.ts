/**
 * #5の直し直し。企画運営の指摘(2026-10-13)に対応。
 * 浮羽稲荷神社「商売繁盛や学問の神として祀られています。」もまだ効き目をうたう
 * 言い方に近いため、「…太宰府天満宮から祀りを受けた三柱を祭神としています。」で
 * 文を終える形に直す(商売繁盛・学問の言葉は入れない)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const INARI_SPOT_ID = "ff95b30e-fc83-4e44-95b3-93d82271e1f0";

async function main() {
  const inari = await prisma.spot.findUnique({ where: { id: INARI_SPOT_ID } });
  if (!inari?.memo) throw new Error("想定と違います");
  const newMemo = inari.memo.replace(
    "京都の伏見稲荷大社・松尾大社、太宰府天満宮から祀りを受けた三柱を祭神とし、商売繁盛や学問の神として祀られています。",
    "京都の伏見稲荷大社・松尾大社、太宰府天満宮から祀りを受けた三柱を祭神としています。"
  );
  if (newMemo === inari.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 浮羽稲荷神社のメモを「…三柱を祭神としています。」で終える形に直す");
  console.log("新メモ:", newMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: INARI_SPOT_ID }, data: { memo: newMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
