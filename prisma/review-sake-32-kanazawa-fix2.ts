/**
 * #32の直し(自己点検)。近江町市場→主計町茶屋街の移動が元々バス(20分)だったが、
 * 間に近江町市場を挿入して距離が縮まった際、transitModeを"walk"に変え忘れていて
 * 「バス9分」という不自然な値になっていた。徒歩9分に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const KAZUEMACHI_SPOT_ID = "13594a40-ac48-4456-a93f-c8eb18f357cd";

async function main() {
  const leg = await prisma.spotTransitLeg.findFirst({ where: { spotId: KAZUEMACHI_SPOT_ID } });
  if (!leg || leg.transitMode !== "bus" || leg.transitDurationMin !== 9) throw new Error("想定と違います");

  console.log("[確認OK] 近江町市場→主計町茶屋街の移動を「バス9分」→「徒歩9分」に修正");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spotTransitLeg.update({ where: { id: leg.id }, data: { transitMode: "walk" } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
