/**
 * #434 8a4dbdb6 の追いの修正（しおりえ(制作補助2)、監査の指摘）
 *   - 大浦天主堂「世界の宗教史上にも類を見ない『信徒発見』」→「世界の宗教史上にも類を見ないといわれる『信徒発見』」
 *   - 出島「日本で唯一、西欧に開かれた窓として」→「日本で唯一、西欧に開かれた窓といわれ、」
 *   - 眼鏡橋は出島から約0.8kmなので、路面電車15分 → 徒歩15分に（本文の「路面電車で」も「歩いて」に）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-434b-8a4dbdb6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8a4dbdb6-47ad-41b4-b035-91e9ebee8d20";
const COMMIT = process.argv.includes("--commit");
const EDITS: [string, string, string, Record<string, unknown>][] = [
  ["大浦天主堂", "世界の宗教史上にも類を見ない「信徒発見」", "世界の宗教史上にも類を見ないといわれる「信徒発見」", {}],
  ["出島", "日本で唯一、西欧に開かれた窓として、日本の近代化に大きな役割を果たしました。", "日本で唯一、西欧に開かれた窓といわれ、日本の近代化に大きな役割を果たしました。", {}],
  ["眼鏡橋", "出島から路面電車で眼鏡橋へ。", "出島から歩いて約15分、眼鏡橋へ。", { transitMode: "walk", transitLine: null, transitDurationMin: 15 }],
];

async function main() {
  const rows = [];
  for (const [name, from, to, extra] of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(from)) throw new Error(`本文が想定と違います: ${name}`);
    rows.push({ id: s.id, data: { memo: s.memo.replace(from, to), ...extra } });
    console.log(name, "OK");
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: r.id }, r.data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
