/**
 * #190 78eab247 の続き（しおりえ(制作補助2)）: 監査の「言い切り?」2件を、同じ文の中でぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-190b-78eab247.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "78eab247-c4ae-4d91-b3d0-e30d0f0c1998";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "湯の川温泉（足湯「湯巡り舞台」）", from: "北海道三大温泉郷の一つに数えられる湯の川温泉の足湯で、", to: "北海道三大温泉郷の一つといわれる湯の川温泉の足湯で、" },
  { name: "トラピスチヌ修道院", from: "1898年に開かれた、日本で初めての女子修道院として知られる修道院です。", to: "1898年に開かれた修道院で、日本で初めての女子修道院とされます。" },
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
