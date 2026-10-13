/**
 * #4の直し(prayer-check指摘)。橘寺・岡寺は今も信仰が続く寺院のため、法務の決まった
 * 形の一文「今も祈りが続く場所ですので、静かに、敬意をもってお参りください。」を
 * メモの末尾に追加する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const PRAYER_LINE = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: "bfe1386c-a512-4723-b195-a67fd732e311" } });
  const tachibana = spots.find((s) => s.name === "橘寺");
  const oka = spots.find((s) => s.name === "岡寺");
  if (!tachibana?.memo || !oka?.memo) throw new Error("想定と違います");

  console.log("[確認OK] 橘寺・岡寺のメモにお参りの一文を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: tachibana.id }, data: { memo: tachibana.memo + PRAYER_LINE } });
  await prisma.spot.update({ where: { id: oka.id }, data: { memo: oka.memo + PRAYER_LINE } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
