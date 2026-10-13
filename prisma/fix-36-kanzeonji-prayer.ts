/**
 * #36 竹崎観世音寺に、配慮の一文(決まりの形)を追加。prayer-checkで検出された。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const MEMO_NEW =
  "太良町竹崎にある古刹です。正月の修正会で奉納される「童子舞」は、この寺だけに伝わる芸能とされ、国の重要無形民俗文化財に指定されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const spot = await prisma.spot.findFirst({ where: { name: "竹崎観世音寺" } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 竹崎観世音寺のメモに決まりの祈りの一文を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: spot.id }, data: { memo: MEMO_NEW } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
