/**
 * #184 6ff2703e の続き（しおりえ(制作補助2)）: 法務の確認で2点を直す
 *   ① てんしば（昼食）の「てんしばイーナ」は商業施設の名前なので外す
 *   ② 清水寺（玉出の滝）の滝に打たれる人の文のあとに、その人を写さない一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-184c-6ff2703e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ff2703e-a791-45af-9afc-ebb75a028bab";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "天王寺公園（てんしば）（昼食）",
    from: "動物園の門のそばの「てんしばイーナ」にも、約5,000㎡の敷地に飲食の店が集まっているので、ここで昼食にしましょう。",
    to: "動物園の門のそばにも、飲食の店が集まる一角があるので、ここで昼食にしましょう。",
  },
  { name: "清水寺（玉出の滝）", from: "今も滝に打たれる人の姿が見られます。", to: "今も滝に打たれる人の姿が見られます。滝に打たれている人を写さないようにしましょう。" },
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
