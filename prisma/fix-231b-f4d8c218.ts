/**
 * #231 f4d8c218 の言い方と安全の一文の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * ① ウィルソン株「屋久島で最も大きな切り株で」→「切り株とされ」
 * ② 荒川登山口: 野生のサル・シカに「近づきすぎない」を足す
 * ③ 荒川登山口: トロッコ道の安全の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-231b-f4d8c218.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "f4d8c218-e9a3-4143-9225-d5d49495c6c1";
const COMMIT = process.argv.includes("--commit");
const EDITS = [
  { name: "ウィルソン株", from: "屋久島で最も大きな切り株で、", to: "屋久島で最も大きな切り株とされ、" },
  { name: "荒川登山口", from: "野生のサルやシカには、食べ物を与えないようにしましょう。", to: "野生のサルやシカには近づきすぎず、食べ物を与えないようにしましょう。" },
  { name: "荒川登山口", from: "ここから約8.5kmのトロッコ道を歩き、約2.5kmの山道を登ります。", to: "ここから約8.5kmのトロッコ道を歩き、約2.5kmの山道を登ります。トロッコ道には手すりのない橋もあるので、枕木の上や橋では足元に気をつけましょう。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: { in: ["ウィルソン株", "荒川登山口"] } } });
  const memos = new Map(spots.map((s) => [s.name, s.memo ?? ""]));
  for (const e of EDITS) {
    const m = memos.get(e.name);
    if (m === undefined || !m.includes(e.from)) throw new Error(`${e.name}: 本文が想定と違います`);
    memos.set(e.name, m.replace(e.from, e.to));
  }
  for (const [n, m] of memos) console.log(`${n}: ${m}\n`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(spots.map((s) => prisma.spot.update({ where: { id: s.id }, data: { memo: memos.get(s.name)! } })));
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
