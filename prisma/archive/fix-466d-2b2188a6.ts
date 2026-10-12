/**
 * #466 2b2188a6 の追いの直し（しおりえ(制作補助2)、法務の指摘 9/30 19:14）
 *   小野川沿いの町並み: 暮らしへの配慮の一文を足す
 *   大本堂（朝の御護摩）: 堂内で撮影しない一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-466d-2b2188a6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2b2188a6-1fba-436c-9f73-91658f0a6386";
const COMMIT = process.argv.includes("--commit");

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const machi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "小野川沿いの町並み" });
  const goma = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "成田山新勝寺 大本堂（朝の御護摩）" });
  const machiMemo = rep(machi.memo ?? "", "昔の面影を残す町並みが今も残っています。", "昔の面影を残す町並みが今も残っています。今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。");
  const gomaMemo = rep(goma.memo ?? "", "公式の案内で確かめましょう。", "公式の案内で確かめましょう。堂内では撮影せず、お寺の決まりに従いましょう。");
  console.log(`町並み: ${machiMemo}`);
  console.log(`御護摩: ${gomaMemo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: machi.id }, { memo: machiMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: goma.id }, { memo: gomaMemo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
