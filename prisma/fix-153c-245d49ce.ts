/**
 * #153 245d49ce の続き（しおりえ(制作補助2)）: 企画運営の確認。まんが図書館の「約155,000冊」は開いた公式ページで確かめられないので外し、
 *   広島市の FAQ（city.hiroshima.lg.jp/site/faq/10688.html「漫画及び漫画に関する資料を体系的に収集・保存するとともに、各種行事を開催しています」）にそって書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-153c-245d49ce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "245d49ce-4687-4b42-ac4c-f62e5d2c6072";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "広島市まんが図書館",
    from: "漫画と漫画に関わる資料を、約155,000冊集めた図書館です。",
    to: "漫画と漫画に関わる資料を集めて保存し、さまざまな催しも開いている図書館です。",
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
