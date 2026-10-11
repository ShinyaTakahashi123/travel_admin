/**
 * #245 0d86de79 の続き（しおりえ(制作補助2)）: audit の指摘で
 *   万座毛「無料の展望デッキ」→「展望デッキ」（お金の言葉を外す）、道の駅許田と説明文「最初にできた・最初の」→「第1号とされる」（「初」をぼかす）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-245b-0d86de79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0d86de79-d869-4906-9bbd-55f534a66241";
const COMMIT = process.argv.includes("--commit");
const SPOT_EDITS = [
  { name: "万座毛", from: "入口の施設の3階には、無料の展望デッキもあります。", to: "入口の施設の3階には、展望デッキもあります。" },
  { name: "道の駅許田", from: "沖縄県で最初にできた道の駅で、", to: "沖縄県で第1号とされる道の駅で、" },
];
const DESC_FROM = "沖縄で最初の道の駅で昼食。";
const DESC_TO = "沖縄で第1号とされる道の駅で昼食。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: true } } } });
  const spots = it.days.flatMap((d) => d.spots);
  const ups: { id: string; memo: string }[] = [];
  for (const e of SPOT_EDITS) {
    const s = spots.filter((x) => x.name === e.name);
    if (s.length !== 1 || (s[0].memo ?? "").split(e.from).length !== 2) throw new Error(`${e.name}: 想定と違います`);
    ups.push({ id: s[0].id, memo: (s[0].memo ?? "").replace(e.from, e.to) });
    console.log(`--- ${e.name}\n${ups[ups.length - 1].memo}`);
  }
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文が想定と違います");
  const desc = (it.description ?? "").replace(DESC_FROM, DESC_TO);
  console.log(`--- 説明文\n${desc}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    ...ups.map((u) => prisma.spot.update({ where: { id: u.id }, data: { memo: u.memo } })),
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: desc } }),
  ]);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
