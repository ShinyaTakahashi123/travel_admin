/**
 * #181 6ac70480 の続き（しおりえ(制作補助2)）: #242（0c542f79）の本文と近い言い回しを書き分ける
 *   ① ならまち（昼食）: 「古民家を生かしたカフェやレストランも多いので」→ #242 の「古い家を生かしたカフェや食事の店」と近いので言い換える
 *   ② 天平うまし館（昼食）: 「大和野菜を使った料理など」→ #242 の「大和野菜を使った料理」と同じなので、出典の「奈良の伝統野菜や郷土の料理」に言い換える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-181c-6ac70480.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ac70480-f655-419c-a820-8a2a46acbfd5";
const COMMIT = process.argv.includes("--commit");
const PLAN = [
  { name: "ならまち（昼食）", from: "古民家を生かしたカフェやレストランも多いので、ここで昼食にしましょう。", to: "町家を改めた店の中には、食事のとれる店も点在しているので、ここで昼食にしましょう。" },
  { name: "朱雀門ひろば 天平うまし館（昼食）", from: "大和野菜を使った料理などが味わえるので、ここで昼食にしましょう。", to: "奈良の伝統野菜や郷土の料理を取り入れた食事が味わえるので、ここで昼食にしましょう。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    const neu = memo.replace(p.from, p.to);
    console.log(`${p.name}: ${neu}`);
    return { id: s[0].id, memo: neu };
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
