/**
 * #24 657f4a15（箱根）企画運営の指摘(2026-09-30 11:03): 説明文が旧い中身のまま
 * （「庭園美術館や公園をゆったり巡る、温泉重視」）。大涌谷のロープウェイ・
 * 芦ノ湖の遊覧船・箱根神社・箱根関所まで回る今の中身に合わせて書き直す。
 * タイトルは変更しない。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";
const NEW_DESCRIPTION =
  "登山電車の終点・強羅エリアに宿泊し、庭園美術館めぐりとロープウェイでの大涌谷めぐり、芦ノ湖の遊覧船や箱根神社・箱根関所を巡る、箱根の見どころを満喫する1泊2日プランです。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN } });
  console.log("現在:", it.description);
  console.log("新規:", NEW_DESCRIPTION);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITIN }, data: { description: NEW_DESCRIPTION } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
