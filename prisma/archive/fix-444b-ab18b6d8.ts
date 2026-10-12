/**
 * #444 ab18b6d8 の追いの修正（しおりえ(制作補助2)、監査の「言い切り?」「徒歩が速すぎ」への対応）
 *   - 豊平館「唯一のホテルで」・円山動物園「北海道で初めての動物園として開園しました」を「とされる」でぼかす
 *   - 大通公園→テレビ塔（0.7km）を徒歩10分・11:10着に。続く狸小路は12:00着・75分に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-444b-ab18b6d8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ab18b6d8-403b-44e1-b7e3-26d813a6e81f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

type Fix = { day: number; name: string; reps: [string, string][]; extra?: Record<string, unknown> };
const fixes: Fix[] = [
  { day: 1, name: "さっぽろテレビ塔", reps: [], extra: { visitTime: t(11, 10), transitDurationMin: 10, stayDurationMin: 40 } },
  { day: 1, name: "狸小路商店街", reps: [], extra: { visitTime: t(12, 0), stayDurationMin: 75 } },
  { day: 1, name: "豊平館", reps: [["明治政府の機関が建てた唯一のホテルで、", "明治政府の機関が建てた唯一のホテルとされ、"]] },
  { day: 2, name: "円山動物園", reps: [["1951年に北海道で初めての動物園として開園しました。", "1951年に、北海道で初めての動物園として開園したとされます。"]] },
];

async function main() {
  const plans: { id: string; day: number; data: Record<string, unknown> }[] = [];
  for (const f of fixes) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: f.day, spotName: f.name });
    let memo = s.memo ?? "";
    for (const [from, to] of f.reps) {
      if (!memo.includes(from)) throw new Error(`${f.name}: 本文が想定と違います: ${from}`);
      memo = memo.replace(from, to);
    }
    const data: Record<string, unknown> = { ...(f.reps.length ? { memo } : {}), ...(f.extra ?? {}) };
    plans.push({ id: s.id, day: f.day, data });
    console.log(`D${f.day} ${f.name}: ${f.reps.length ? memo : ""} ${f.extra ? JSON.stringify(f.extra) : ""}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plans) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: p.day, spotId: p.id }, p.data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
