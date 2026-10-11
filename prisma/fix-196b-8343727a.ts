/**
 * #196 8343727a の続き（しおりえ(制作補助2)）: 監査の「日程の記載」を直す（もてなしの館の「毎週替わる」を外す）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-196b-8343727a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "8343727a-f061-4eba-bdba-92d051fc3d0e";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "吉備路もてなしの館（昼食）", from: "毎週替わるギャラリーもあります。", to: "展示の替わるギャラリーもあります。" },
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
