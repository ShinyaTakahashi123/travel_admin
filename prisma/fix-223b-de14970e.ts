/**
 * #223 de14970e の言い方の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * - 伯方塩業 大三島工場: 本文の商品のブランド名（「伯方の塩」）を外す（スポット名は施設名なのでそのまま）
 * - マーレ・グラッシア大三島: 体へのききめをうたう言い方（タラソテラピー・疲れをいやす）を外し、ほかの入浴客を撮らない・長湯を避ける一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-223b-de14970e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "de14970e-a4e3-4965-8e4d-48880047786b";
const COMMIT = process.argv.includes("--commit");
const EDITS: { name: string; from: string; to: string }[] = [
  { name: "伯方塩業 大三島工場", from: "「伯方の塩」をつくる工場で、", to: "塩をつくる工場で、" },
  {
    name: "マーレ・グラッシア大三島",
    from: "海の力を生かす療法・タラソテラピーを取り入れた、海水の温浴施設です。海水風呂や露天風呂で、一日の疲れをいやせます。休館日は公式の案内で確かめましょう。湯につかる前後には、水分をとりましょう。",
    to: "海水を使った温浴施設で、海水風呂や露天風呂があります。休館日は公式の案内で確かめましょう。湯につかる前後には水分をとり、長湯は避けましょう。ほかの入浴客を撮影するのはやめましょう。",
  },
];

async function main() {
  const updates = [];
  for (const e of EDITS) {
    const spots = await prisma.spot.findMany({ where: { name: e.name, day: { itineraryId: ITINERARY_ID } } });
    if (spots.length !== 1 || !(spots[0].memo ?? "").includes(e.from)) throw new Error(`${e.name}: 構成が想定と違います`);
    const memo = spots[0].memo!.replace(e.from, e.to);
    console.log(`${e.name}: ${memo}\n`);
    updates.push(prisma.spot.update({ where: { id: spots[0].id }, data: { memo } }));
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(updates);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
