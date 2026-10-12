/**
 * #150 20a8c441 の続き（しおりえ(制作補助2)）: 法務の確認。リトルワールド（本館展示）の「開館は朝10時です」は時刻なので外し、時間と休館日の一文にまとめる
 * （同じスポットに2か所の直しがあるので、本文全体を1回で置き換える）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-150b-20a8c441.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "20a8c441-9e14-4ed5-a2ed-667a9350e79f";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "リトルワールド（本館展示）",
    from: "大縣神社から車で約15分。1983年に開かれた野外民族博物館で、開館は朝10時です。まず本館展示へ。70をこえる国と地域から集めた約6,000点の資料を、「進化・技術・言語・社会・価値」の5つのテーマで紹介していて、世界の人々の暮らしを広く見渡せます。閉館の時間と休館日は日によって違うので、公式の案内で確かめましょう。",
    to: "大縣神社から車で約15分。1983年に開かれた野外民族博物館です。まず本館展示へ。70をこえる国と地域から集めた約6,000点の資料を、「進化・技術・言語・社会・価値」の5つのテーマで紹介していて、世界の人々の暮らしを広く見渡せます。開館と閉館の時間、休館日は日によって違うので、公式の案内で確かめましょう。",
  },
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
