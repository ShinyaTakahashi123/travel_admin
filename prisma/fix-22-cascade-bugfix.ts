/**
 * #22(55e932b6)の自己点検。fix-replace-22-naharir.tsで leg(モネの庭→奈半利の町並み)を
 * 10分→4分に短縮したが、奈半利の町並み自身のvisitTimeを更新し忘れており、
 * 12:40のままだと直前のスポット(モネの庭、10:50-12:30)の終了より後ろにずれて
 * いなかった一方、後続スポット(道の駅田野駅屋、13:46開始)との間で、13:50終了
 * (12:40+70分)が13:46開始より後になり重なっていた。正しくは
 * 12:30(モネの庭終了)+4分=12:34開始。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const NAHARI_SPOT_ID = "7c62d14d-06fc-410c-aaab-4f872cc87938";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: NAHARI_SPOT_ID } });
  if (!spot || !spot.visitTime) throw new Error("想定と違います");

  console.log("[確認OK] 奈半利の町並み（昼食）visitTime:", spot.visitTime.toISOString().slice(11, 16), "→ 12:34");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: NAHARI_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 34)) } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
