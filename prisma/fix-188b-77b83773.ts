/**
 * #188 77b83773 の続き（しおりえ(制作補助2)）: 企画運営の確認で、彦根城の階段の一文が #248 と同じなので言い回しを変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-188b-77b83773.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "77b83773-6635-47f0-a22b-ec99cf45b91e";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  { name: "彦根城", from: "天守の階段は急なので、手すりにつかまって上り下りしましょう。", to: "天守の中ははしごのように急な階段が続くので、手すりを持ち、一段ずつゆっくり上り下りしましょう。" },
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
