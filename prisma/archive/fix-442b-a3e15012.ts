/**
 * #442 a3e15012 の追いの修正（しおりえ(制作補助2)、監査の「徒歩が速すぎ 0.6km/5分」）: 運河の乗り場からドムトールンまでを徒歩10分・11:30着に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-442b-a3e15012.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "a3e15012-77c4-44cc-a9c8-122166b98c68";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "ドムトールン（ハウステンボス）" });
  const data = { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 30)), transitDurationMin: 10 };
  console.log(s.name, JSON.stringify(data));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
