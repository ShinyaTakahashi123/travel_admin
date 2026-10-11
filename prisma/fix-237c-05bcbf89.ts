/**
 * #237 05bcbf89 の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 14:02、記録 18cd7db）の3点を直す
 *   ① 旧福浦灯台: 被災地の道路と復旧への配慮の一文を足す
 *   ② 和倉温泉: 総湯に入るときの一文（ほかの人を撮らない・長湯を避ける・水分をとる）を足す
 *   ③ 巌門: 遊覧船に乗るときの一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-237c-05bcbf89.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "05bcbf89-5126-4f05-a15e-28b6d6a0f283";
const COMMIT = process.argv.includes("--commit");
const EDITS: { name: string; after: string; add: string }[] = [
  { name: "旧福浦灯台", after: "のと里山海道を北へ、車で約75分。",
    add: "地震のあと、道路の通行止めや復旧の工事が続いているところもあるので、出かける前に道路の情報を確かめ、復旧に取り組む地域の人たちの迷惑にならないようにしましょう。" },
  { name: "巌門", after: "（冬のあいだは運休します。運航は公式の案内で確かめましょう）。",
    add: "船に乗るときは、係の人の案内に従いましょう。" },
  { name: "和倉温泉", after: "足湯では、ほかの人を写さないようにし、掲示の案内に従いましょう。",
    add: "総湯では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。" },
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
