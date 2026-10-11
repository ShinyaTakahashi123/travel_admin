/**
 * #191 79f54318 の続き（しおりえ(制作補助2)）: 法務の確認で、銚子大滝の言い切りを同じ文の中でぼかし、雲井の滝に足元の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-191b-79f54318.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "79f54318-346f-4cd9-8e21-c26c4f044c1c";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "銚子大滝", from: "奥入瀬渓流の本流にかかる滝はこれだけです。", to: "奥入瀬渓流の本流にかかる滝はこれだけとされます。" },
  { name: "雲井の滝（途中に阿修羅の流れ）", from: "3段になって落ちる、水量の多い滝です。", to: "3段になって落ちる、水量の多い滝です。滝の近くの岩は水しぶきで濡れていることが多いので、足元に気をつけましょう。" },
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
