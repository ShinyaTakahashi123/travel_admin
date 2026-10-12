/**
 * #200 9a719ffb 飛鳥寺の言い切りをやわらげる（しおりえ(制作補助2)、2026-10-01 itinerary-audit「言い切り?」）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-200e-9a719ffb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9a719ffb-4a30-415f-bf49-b86c4c744759";
const COMMIT = process.argv.includes("--commit");
const O = "日本最古級の仏像の一つとして親しまれています。";
const N = "日本最古級の仏像の一つといわれ、今も親しまれています。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "飛鳥寺" });
  if (!s.memo?.includes(O)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(O, N);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
