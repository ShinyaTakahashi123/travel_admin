/**
 * #448 bbc2264b の言い回しの直し（しおりえ(制作補助2)、itinerary-audit の指摘「言い切り?」）
 *   びわ湖大津館「県内初の国際観光ホテル」→「県内初とされる国際観光ホテル」、大津閘門「日本初のレンガ造りの本格的な閘門として」→「日本初のレンガ造りの本格的な閘門とされ、」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-448b-bbc2264b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "bbc2264b-5108-4228-8d22-35f42dd603c7";
const COMMIT = process.argv.includes("--commit");
const FIXES: [string, string, string][] = [
  ["びわ湖大津館", "外国人観光客を迎えるための県内初の国際観光ホテルとして建てられた", "外国人観光客を迎えるための、県内初とされる国際観光ホテルとして建てられた"],
  ["琵琶湖疏水（大津閘門）", "日本初のレンガ造りの本格的な閘門として注目を集めました。", "日本初のレンガ造りの本格的な閘門とされ、当時注目を集めました。"],
];

async function main() {
  const todo: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [name, from, to] of FIXES) {
    const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!(spot.memo ?? "").includes(from)) throw new Error(`本文が想定と違います: ${name}`);
    todo.push({ spot, memo: (spot.memo ?? "").replace(from, to) });
    console.log(`${name}: …${to}…`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const { spot, memo } of todo) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
