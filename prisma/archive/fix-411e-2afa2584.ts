/**
 * #411 2afa2584 の言い回しの直し（しおりえ(制作補助2)、企画運営の指示 9/30 18:23）
 *   足利織姫神社「産業振興と縁結びの神様として親しまれています。」はご利益をうたう言い方に寄るので、
 *   「産業振興や縁結びを願う人も多くお参りする神社です。」に（「赤いお宮」の数語は法務と相談して可とされた件なので残す）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-411e-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "足利織姫神社" });
  const from = "産業振興と縁結びの神様として親しまれています。", to = "産業振興や縁結びを願う人も多くお参りする神社です。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`織姫神社: …${to}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
