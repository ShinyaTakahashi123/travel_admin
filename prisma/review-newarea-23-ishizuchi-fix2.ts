/**
 * #23の直し(自己点検)。1番目のスポット「石鎚登山ロープウェイ」に、もとの
 * 構成(本社→ロープウェイの移動、30分車)の古い移動データが残ったままだった。
 * 1日の最初のスポットには移動データは不要なため削除する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const STALE_LEG_ID = "3a2d9672-6981-438f-8ff8-1d33972504c3";

async function main() {
  const leg = await prisma.spotTransitLeg.findUnique({ where: { id: STALE_LEG_ID } });
  if (!leg || leg.spotId !== "56a4e551-a558-441a-a6e6-ab9da47461d2") throw new Error("想定と違います");

  console.log("[確認OK] 1番目のスポット(石鎚登山ロープウェイ)の古い移動データを削除");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spotTransitLeg.delete({ where: { id: STALE_LEG_ID } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
