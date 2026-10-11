/**
 * #196 8343727a の続き（しおりえ(制作補助2)）: 法務の確認で、作山古墳の言い切りを同じ文の中でぼかし、高松城址の「7月中旬」を「7月ごろ」にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-196d-8343727a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "8343727a-f061-4eba-bdba-92d051fc3d0e";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "作山古墳", from: "全国で10番目、県内で2番目の大きさです。", to: "全国で10番目、県内で2番目の大きさとされます。" },
  { name: "備中高松城址", from: "7月中旬には", to: "7月ごろには" },
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
