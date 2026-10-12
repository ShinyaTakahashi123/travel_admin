/**
 * #189 789cfdef の続き（しおりえ(制作補助2)）: 監査の「近いのに car 10分（0.4km）」を直す
 *   妖怪街道へは遊覧船の乗り場から歩いて約6分（13:01〜13:31）。定福寺へは乗り場の駐車場へ歩いて戻り、車で約28分（あわせて約34分、着くのは14:05のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-189b-789cfdef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "789cfdef-1580-4fda-ada3-4bc8709e05a9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type L = { mode: "walk" | "car"; min: number };
const PLAN: { name: string; h: number; m: number; stay: number; legs: L[]; from: string; to: string }[] = [
  { name: "山城大歩危妖怪村（妖怪街道）", h: 13, m: 1, stay: 30, legs: [{ mode: "walk", min: 6 }], from: "遊覧船の乗り場から車で約10分。", to: "遊覧船の乗り場から歩いて約6分。" },
  { name: "定福寺", h: 14, m: 5, stay: 60, legs: [{ mode: "walk", min: 6 }, { mode: "car", min: 28 }], from: "妖怪街道から車で約30分、", to: "遊覧船の乗り場の駐車場へ歩いて戻り、車で約28分（あわせて約34分）、" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    const next = memo.replace(p.from, p.to);
    console.log(`${p.name}: ${p.h}:${String(p.m).padStart(2, "0")} 滞在${p.stay}分 ${p.legs.map((l) => l.mode + l.min).join("+")}\n  ${next.slice(0, 80)}…`);
    return { id: s[0].id, data: { visitTime: t(p.h, p.m), stayDurationMin: p.stay, memo: next, transitLegs: { deleteMany: {}, create: p.legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: null })) } } };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: o.data });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
