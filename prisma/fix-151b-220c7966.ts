/**
 * #151 220c7966 の続き（しおりえ(制作補助2)）: 企画運営の確認で1点を直す
 *   塩屋埼灯台の映画の文から、一般の人の名前（体験記を書いた人）を外す
 *   出典 city.iwaki.lg.jp/www/contents/1481507493705/ は「体験記が映画化」「夫婦役の俳優による作品」とだけあるので、「灯台で暮らした家族の体験記」と書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-151b-220c7966.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "220c7966-7d85-4c62-85d1-4a047bd57338";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "塩屋埼灯台", from: "灯台で暮らした田中きよさんの体験記が映画になり、", to: "灯台で暮らした家族の体験記が映画になり、" },
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
