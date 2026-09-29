/**
 * #422 58c64d69 の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 会津武家屋敷: 「無料の音声ガイド」の「無料」を外す（料金は書かない決まり）
 * - さざえ堂: 観音参りのお堂なので、配慮の一文を足す（prayer-check で見つかったため）
 * - 御薬園: 着く時刻を 11:10 に（移動15分に合わせる）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-422b-58c64d69.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "58c64d69-20fc-4509-912f-a99098a6d0fe";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const EDITS: [string, string, string][] = [
  ["会津武家屋敷（昼食）", "館内には無料の音声ガイドがあり、", "館内には音声ガイドがあり、"],
  ["さざえ堂", "国の重要文化財に指定されています。", "国の重要文化財に指定されています。静かに、敬意をもってお参りしましょう。"],
];

async function main() {
  const rows = [];
  for (const [name, o, n] of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(o)) throw new Error(`本文が想定と違います: ${name}`);
    rows.push({ id: s.id, data: { memo: s.memo.replace(o, n) } as Record<string, unknown> });
    console.log(`${name}: ${n}`);
  }
  const y = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "御薬園" });
  rows.push({ id: y.id, data: { visitTime: t(11, 10) } });
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
