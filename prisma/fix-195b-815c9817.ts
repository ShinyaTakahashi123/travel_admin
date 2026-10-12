/**
 * #195 815c9817 の続き（しおりえ(制作補助2)）: 監査の「時刻の計算が合わない」2件を直す
 *   ひろめ市場へは歩いて約5分、山内神社へは歩いて約15分（着く時刻はそのまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-195b-815c9817.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "815c9817-f49e-4bb6-8b8b-ba7d5c6e4b6f";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; min: number; from: string; to: string }[] = [
  { name: "ひろめ市場（昼食）", min: 5, from: "博物館から歩いて約3分。", to: "博物館から歩いて約5分。" },
  { name: "山内神社", min: 15, from: "ひろめ市場から南へ歩いて約12分、", to: "ひろめ市場から南へ歩いて約15分、" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    console.log(`${p.name}: walk ${p.min}分`);
    return { id: s[0].id, data: { memo: memo.replace(p.from, p.to), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: p.min, transitLine: null }] } } };
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
