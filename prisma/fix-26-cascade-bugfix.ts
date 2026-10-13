/**
 * #26(258b3878)の自己点検漏れ(企画運営指摘、2026-10-13)。fix-replace-26-ukiha3.tsで
 * 居蔵の館→調音の滝公園のlegを10→14分に伸ばし、調音の滝公園のvisitTimeを
 * 10:30→10:34に更新したが、道の駅うきは(次のスポット)のvisitTimeを
 * 更新し忘れており、11:30のままだった。正しくは
 * 11:19(調音の滝公園終了)+15分(leg)=11:34開始。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const EKI_UKIHA_ID = "5bda41e2-6fbd-4ca9-9dcf-48e08ce2e203";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: EKI_UKIHA_ID } });
  if (!spot || !spot.visitTime) throw new Error("想定と違います");

  console.log("[確認OK] 道の駅うきは（昼食）visitTime:", spot.visitTime.toISOString().slice(11, 16), "→ 11:34");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: EKI_UKIHA_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 34)) } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
