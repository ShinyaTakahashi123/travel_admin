/**
 * #184 6ff2703e の続き（しおりえ(制作補助2)）: 企画運営の確認で3点を直す
 *   ① 安倍晴明神社の書き出しが e6eb7aab の文とほぼ同じなので、書き出しを言い換え、大正10年の復興の話（e6eb7aab にもある）も外す
 *   ② 大阪市立美術館の「中央のホールは無料で入れる」は料金の話なので外す
 *   ③ 一心寺で「静かに、敬意をもって〜」が2回続くので、しのぶ一文を言い換えて1回にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-184b-6ff2703e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ff2703e-a791-45af-9afc-ebb75a028bab";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "安倍晴明神社",
    from: "平安時代の陰陽師・安倍晴明が生まれた地と伝わる場所にある神社です。境内には、江戸時代の文政年間に建てられた晴明誕生の地を示す碑や、産湯の跡があります。幕末にいったん衰えましたが、大正10年に阿倍王子神社の末社として復興し、今の社殿は大正14年に建てられたといわれます。日替わりの占いのコーナーもあります。",
    to: "このあたりは安倍晴明の誕生の地と伝わり、境内には江戸時代の文政年間に建てられた、そのことを示す石碑や、晴明の産湯の跡とされる場所が残ります。今の社殿は大正14年に建てられたといわれ、小さな境内には日替わりの占いのコーナーもあります。",
  },
  { name: "大阪市立美術館", from: "中央のホールは無料で入れるので、気軽に立ち寄れます。", to: "" },
  { name: "一心寺", from: "亡くなった方々をしのぶ場所ですので、静かに、敬意をもって見学しましょう。", to: "遺骨を納めた多くの方々をしのぶお寺でもあります。" },
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
