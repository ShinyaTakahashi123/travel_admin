/**
 * #438 92a02406 の追いの修正（しおりえ(制作補助2)、監査の「言い切り」）: 水戸城跡の「日本最大級の土造りの城」「唯一現存する建物の薬医門」をぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-438b-92a02406.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "92a02406-a0f0-4720-a1aa-6012cb6a1928";
const COMMIT = process.argv.includes("--commit");
const EDITS: [string, string][] = [
  ["日本最大級の土造りの城で、", "日本最大級とされる土造りの城で、"],
  ["水戸城で唯一現存する建物の薬医門は、", "水戸城で唯一の現存建築とされる薬医門は、"],
];

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "水戸城跡（大手門・薬医門）" });
  let memo = s.memo ?? "";
  for (const [from, to] of EDITS) {
    if (!memo.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
    memo = memo.replace(from, to);
  }
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
