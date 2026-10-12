/**
 * #195 815c9817 の続き（しおりえ(制作補助2)）: 企画運営の確認で、高知城の階段の一文（fa4c2ce4 とほぼ同じ）の言い回しを変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-195c-815c9817.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "815c9817-f49e-4bb6-8b8b-ba7d5c6e4b6f";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "高知城", from: "天守の中の階段は急なので、手すりを持ってゆっくり上り下りしましょう。", to: "天守の上の階へは、はしごのように段の高い階段を上るので、足元を確かめながら一段ずつ進みましょう。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    const next = memo.replace(p.from, p.to);
    console.log(`${p.name}:\n  ${next}\n`);
    return { id: s[0].id, memo: next };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: { memo: o.memo } });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
