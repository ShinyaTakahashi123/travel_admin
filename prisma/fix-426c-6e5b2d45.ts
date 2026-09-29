/**
 * #426 6e5b2d45 の追いの修正2（しおりえ(制作補助2)、法務の指摘）
 *   - 大福山展望台「市原市でいちばん高い山で」→「市原市でいちばん高い山とされ」
 *   - 夷隅神社「牛頭天皇宮」→「牛頭天王宮」（大多喜町のページは「牛頭（ごず）天皇宮」と書いているが、牛頭天王の誤記）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-426c-6e5b2d45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "6e5b2d45-92e1-4cfe-913d-b80babce8573";
const COMMIT = process.argv.includes("--commit");
const EDITS: [number, string, string, string][] = [
  [1, "大福山展望台", "市原市でいちばん高い山で、", "市原市でいちばん高い山とされ、"],
  [2, "夷隅神社", "牛頭天皇宮", "牛頭天王宮"],
];

async function main() {
  const rows = [];
  for (const [day, name, from, to] of EDITS) {
    const s = await prisma.spot.findFirstOrThrow({ where: { name, day: { itineraryId: ITINERARY_ID } }, select: { id: true, memo: true } });
    if (!s.memo?.includes(from)) throw new Error(`本文が想定と違います: ${name}`);
    rows.push({ day, id: s.id, memo: s.memo.replace(from, to) });
    console.log(name, "→", s.memo.replace(from, to).slice(0, 80));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: r.day, spotId: r.id }, { memo: r.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
