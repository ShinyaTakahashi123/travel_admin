/**
 * #457 e8a7f2d5 の言い回しの直し（しおりえ(制作補助2)、法務の指摘 9/30 17:53）
 *   足羽山公園「福井の礎を築いた継体天皇の像」→ 伝承なので「福井の礎を築いたと伝わる継体天皇の像」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-457c-e8a7f2d5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e8a7f2d5-3e1a-4547-baeb-7021060f1fce";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "足羽山公園" });
  const from = "福井の礎を築いた継体天皇の像", to = "福井の礎を築いたと伝わる継体天皇の像";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`足羽山公園: …${to}…`);
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
