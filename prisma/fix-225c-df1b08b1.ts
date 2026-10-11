/**
 * #225 df1b08b1 の季節と昼食の一文の直し（しおりえ(制作補助2)、企画運営の決定 10/11）
 * - 季節を「春・夏・秋」にする（winter を外す）。1日目の昼食の店（さど観光ナビ detail0346）は12月〜3月が休み、トビシマカンゾウは初夏の花のため
 * - 大野亀: 「（冬の間は休むので、事前に確かめましょう）」→ 出典の休み（12月〜3月）に合わせて「（店の営業は4月〜11月なので、事前に確かめましょう）」
 * - 尖閣湾揚島遊園: 出典（detail0035）に海中透視船の運航期間の記載はなく、12月〜2月の営業は公式サイトを見るように書かれている。
 *   季節から冬を外したので期間は書かず、「船の運航は公式の案内で確かめましょう」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-225c-df1b08b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "df1b08b1-02e9-4397-a71e-46c51bebbf88";
const COMMIT = process.argv.includes("--commit");
const EDITS = [
  { name: "大野亀", from: "（冬の間は休むので、事前に確かめましょう）", to: "（店の営業は4月〜11月なので、事前に確かめましょう）" },
  { name: "尖閣湾揚島遊園", from: "湾の中をめぐる海中透視船もあります。", to: "湾の中をめぐる海中透視船もあります（船の運航は公式の案内で確かめましょう）。" },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  console.log(`季節: ${it.seasons.join(",")} → spring,summer,autumn`);
  const ops = [];
  for (const e of EDITS) {
    const spots = await prisma.spot.findMany({ where: { name: e.name, day: { itineraryId: ITINERARY_ID } } });
    if (spots.length !== 1 || !(spots[0].memo ?? "").includes(e.from)) throw new Error(`${e.name}: 本文が想定と違います`);
    const memo = spots[0].memo!.replace(e.from, e.to);
    console.log(`\n${e.name}: ${memo}`);
    ops.push(prisma.spot.update({ where: { id: spots[0].id }, data: { memo } }));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } }), ...ops]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
