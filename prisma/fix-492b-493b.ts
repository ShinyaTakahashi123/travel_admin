/**
 * 追いの小さな直し（しおりえ(制作補助2)、2026-10-01）
 * - #492 443379ac 高松塚古墳: 法務の提案「古墳はお墓でもありますので、静かに見学しましょう。」を足す
 * - #493 ba8c13f1 関門海峡（人道入口）: 和布刈神社から約0.6kmなのに「歩いてすぐ・5分」だったので「約10分」に（監査の「徒歩が速すぎ」）。時刻は16:05〜16:40
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-492b-493b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const FIXES: { it: string; day: number; name: string; o: string; n: string; extra?: Record<string, unknown> }[] = [
  { it: "443379ac-eac1-427a-859b-34aaece19786", day: 2, name: "高松塚古墳", o: "石槨の模型を見学できます。", n: "石槨の模型を見学できます。古墳はお墓でもありますので、静かに見学しましょう。" },
  { it: "ba8c13f1-d71a-41ac-9fa2-ec6a3565695f", day: 3, name: "関門海峡（人道入口）", o: "神社から歩いてすぐ、関門トンネル人道の門司側の入口へ。", n: "神社から歩いて約10分、関門トンネル人道の門司側の入口へ。",
    extra: { visitTime: t(16, 5), stayDurationMin: 35, transitDurationMin: 10 } },
];

async function main() {
  const rows = [];
  for (const f of FIXES) {
    const s = await findSpotInItinerary(f.it, { dayNumber: f.day, spotName: f.name });
    if (!s.memo?.includes(f.o)) throw new Error(`本文が想定と違います: ${f.name}`);
    const memo = s.memo.replace(f.o, f.n);
    console.log(`\n■ ${f.it.slice(0, 8)} ${f.name}\n${memo}`);
    rows.push({ f, id: s.id, memo });
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(r.f.it, { dayNumber: r.f.day, spotId: r.id }, { memo: r.memo, ...(r.f.extra ?? {}) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
