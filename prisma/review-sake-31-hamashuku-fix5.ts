/**
 * #31の直し(自己点検)。HAMA BARのstayDurationMinが、前の組み直し(16:30ちょうど
 * に合わせた62分)のまま残っていて、今回の組み直しで開始が16:14になった結果
 * 17:16終了になっていた。40分に戻す(16:54終了、16:30〜17:00の範囲内)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const HAMABAR_SPOT_ID = "27786a13-7105-4742-824c-9e56052415c2";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: HAMABAR_SPOT_ID } });
  if (!spot || spot.stayDurationMin !== 62) throw new Error("想定と違います");

  console.log("[確認OK] HAMA BARの滞在を62分→40分に修正(16:14開始→16:54終了)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: HAMABAR_SPOT_ID }, data: { stayDurationMin: 40 } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
