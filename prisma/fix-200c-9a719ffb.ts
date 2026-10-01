/**
 * #200 9a719ffb の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の任意の提案）
 * - 高松塚古墳に「古墳はお墓でもありますので、静かに見学しましょう。」（#492 と同じ一文）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-200c-9a719ffb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9a719ffb-4a30-415f-bf49-b86c4c744759";
const COMMIT = process.argv.includes("--commit");
const O = "石槨の模型を見学できます。";
const N = "石槨の模型を見学できます。古墳はお墓でもありますので、静かに見学しましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "高松塚古墳" });
  if (!s.memo?.includes(O) || s.memo.includes("お墓でもあります")) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(O, N);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
