/**
 * #464 1756ab5e の追いの直し（しおりえ(制作補助2)）: 佐田沈下橋の「最も下流・最も長い」を言い切らない形に（itinerary-audit の言い切りの指摘）
 * 出典: こうち旅ネット https://kochi-tabi.jp/search_spot_sightseeing.html?id=709 （「最下流・最長を誇る橋」）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-464b-1756ab5e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "1756ab5e-1ddc-4cc5-ac6e-1d8ccbc77b8e";
const COMMIT = process.argv.includes("--commit");
const FROM = "四万十川の沈下橋のなかで最も下流にあり、最も長い橋で、";
const TO = "四万十川の沈下橋のなかで最も下流にあり、最も長い橋とされ、";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "佐田沈下橋" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(`佐田沈下橋: ${memo.slice(0, 80)}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
