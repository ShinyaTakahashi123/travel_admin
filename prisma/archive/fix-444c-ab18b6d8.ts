/**
 * #444 ab18b6d8 の追いの修正2（しおりえ(制作補助2)、法務の指摘）
 *   - 狸小路「北海道で最も古い商店街の一つです」→「…の一つとされます」
 *   - 中島公園「小堀遠州が設計した茶室『八窓庵』」→ 遠州の作は言い伝えなので「小堀遠州の作と伝わる茶室『八窓庵』」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-444c-ab18b6d8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ab18b6d8-403b-44e1-b7e3-26d813a6e81f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

type Fix = { day: number; name: string; reps: [string, string][]; extra?: Record<string, unknown> };
const fixes: Fix[] = [
  { day: 1, name: "狸小路商店街", reps: [["北海道で最も古い商店街の一つです。", "北海道で最も古い商店街の一つとされます。"]] },
  { day: 1, name: "中島公園", reps: [["江戸時代の茶人・小堀遠州が設計した茶室「八窓庵」があり、", "江戸時代の茶人・小堀遠州の作と伝わる茶室「八窓庵」があり、"]] },
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
