/**
 * #154 26d252e6 の続き（しおりえ(制作補助2)）: 法務の確認。西教寺の「手を合わせて」は墓所で祈りのしぐさを求める言い方なので使わない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-154c-26d252e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "26d252e6-106f-49b2-9b2f-90d29fa04455";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "西教寺", from: "お墓の前では、手を合わせて静かにお参りしましょう。", to: "一族の墓のまわりでは、静かに過ごしましょう。" },
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
