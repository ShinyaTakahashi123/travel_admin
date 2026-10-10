/**
 * #471 7da7343c の言い回しの直し（しおりえ(制作補助2)、出典に合わせる）
 *   古代出雲歴史博物館: 「かつての巨大な本殿を支えた宇豆柱」→ 出典どおり「出雲大社本殿の巨大な宇豆柱」
 *   命主社: 「社の前には」→ 出典に位置の記載がないので「境内には」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-471c-7da7343c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7da7343c-0d38-4c30-8818-42ba7d184d2b";
const COMMIT = process.argv.includes("--commit");

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const museum = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "島根県立古代出雲歴史博物館" });
  const inochi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "命主社" });
  const museumMemo = rep(museum.memo ?? "", "国宝の銅剣・銅鐸や、かつての巨大な本殿を支えた宇豆柱などを", "国宝の銅剣・銅鐸や、出雲大社本殿の巨大な宇豆柱などを");
  const inochiMemo = rep(inochi.memo ?? "", "社の前には、推定樹齢1000年", "境内には、推定樹齢1000年");
  console.log(museumMemo);
  console.log(inochiMemo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: museum.id }, { memo: museumMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: inochi.id }, { memo: inochiMemo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
