/**
 * #185 7135a922 の続き（しおりえ(制作補助2)）: 企画運営の確認で、東尋坊の「〜そうです」を「〜とされます」にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-185b-7135a922.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "7135a922-0fcf-45b7-bcdc-3b421527da2e";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "東尋坊（昼食と散策）", from: "見られることもあるそうです。", to: "見られることもあるとされます。" },
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
