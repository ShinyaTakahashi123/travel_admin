/**
 * #193 7c4b9140 の続き（しおりえ(制作補助2)）: 企画運営の確認で、西公園の「市内で最も歴史のある公園」を同じ文の中でぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-193b-7c4b9140.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "7c4b9140-57ad-4526-b415-385423403358";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "西公園", from: "明治8年（1875年）に開かれた、市内で最も歴史のある公園で、", to: "明治8年（1875年）に開かれた、市内で最も歴史のある公園とされ、" },
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
