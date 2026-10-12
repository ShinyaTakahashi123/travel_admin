/**
 * #192 7c32856d の続き（しおりえ(制作補助2)）: 企画運営の確認で、秩父神社の帰りの一文を祈りの一文のあとへ移す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-192b-7c32856d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "7c32856d-87b9-465d-bd0c-8c3747032d79";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "秩父神社",
    from: "帰りは、西武秩父駅まで歩いて約15分です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
    to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。帰りは、西武秩父駅まで歩いて約15分です。",
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
