/**
 * #167 4f25a5b4 の続き（しおりえ(制作補助2)）: 中之島図書館の「日曜・祝日は休館」は曜日の記載なので外す（監査の指摘）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-167b-4f25a5b4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "4f25a5b4-3398-4532-958e-c6e67d5b999b";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "大阪府立中之島図書館",
    from: "日曜・祝日は休館なので、その日は外から眺めましょう。",
    to: "休館日は公式の案内で確かめ、休みの日は外から眺めましょう。",
  },
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
