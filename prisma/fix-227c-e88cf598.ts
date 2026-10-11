/**
 * #227 e88cf598 の足湯・飲泉の一文の追加（しおりえ(制作補助2)、法務の指摘 10/11）
 * 株湯・薬師の湯の足湯と飲泉場に、「ほかの人を撮らない」「飲泉は案内に従い、飲みすぎない」の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-227c-e88cf598.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "e88cf598-ee6a-4351-a185-f90ff6ed7b78";
const COMMIT = process.argv.includes("--commit");
const EDITS = [
  { name: "三朝温泉 株湯", from: "足湯では、ほかの人に湯がかからないように気をつけましょう。", to: "足湯では、ほかの人に湯がかからないように気をつけ、ほかの人を撮影するのはやめましょう。飲泉は飲泉場の案内に従い、飲みすぎないようにしましょう。" },
  { name: "薬師の湯", from: "健康を願ってお参りする人も多い場所です。", to: "健康を願ってお参りする人も多い場所です。足湯ではほかの人を撮影せず、飲泉は案内に従って、飲みすぎないようにしましょう。" },
];

async function main() {
  const ops = [];
  for (const e of EDITS) {
    const spots = await prisma.spot.findMany({ where: { name: e.name, day: { itineraryId: ITINERARY_ID } } });
    if (spots.length !== 1 || !(spots[0].memo ?? "").includes(e.from)) throw new Error(`${e.name}: 本文が想定と違います`);
    const memo = spots[0].memo!.replace(e.from, e.to);
    console.log(`${e.name}: ${memo}\n`);
    ops.push(prisma.spot.update({ where: { id: spots[0].id }, data: { memo } }));
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ops);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
