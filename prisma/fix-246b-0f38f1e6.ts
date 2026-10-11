/**
 * #246 0f38f1e6 の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 14:55、記録 c6207aa）の2点を直す
 *   ① 中瀬沼探勝路: 磐梯山は活火山なので、火山の情報を確かめる一文を足す
 *   ② 中瀬沼探勝路・小野川不動滝: 森の道を歩くので、クマの一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-246b-0f38f1e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0f38f1e6-8366-4f6e-a646-428078f069e4";
const COMMIT = process.argv.includes("--commit");
const EDITS: { name: string; after: string; add: string }[] = [
  { name: "中瀬沼探勝路", after: "いくつも見られます。",
    add: "磐梯山は今も活動している火山なので、出かける前に火山の情報を確かめましょう。クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。" },
  { name: "小野川不動滝", after: "歩きやすい靴で足元に気をつけて歩きましょう。",
    add: "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ups: { id: string; memo: string }[] = [];
  for (const e of EDITS) {
    const s = spots.filter((x) => x.name === e.name);
    if (s.length !== 1) throw new Error(`${e.name}: ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(e.after).length !== 2) throw new Error(`${e.name}: 差し込む位置が見つからない`);
    if (memo.includes(e.add)) throw new Error(`${e.name}: もう入っています`);
    const neu = memo.replace(e.after, e.after + e.add);
    console.log(`--- ${e.name}\n${neu}\n`);
    ups.push({ id: s[0].id, memo: neu });
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ups.map((u) => prisma.spot.update({ where: { id: u.id }, data: { memo: u.memo } })));
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
