/**
 * #189 789cfdef の続き（しおりえ(制作補助2)）: 企画運営の確認で、e4f374cb と近い2文を言い換える
 *   ① 大歩危峡: 天然記念物と名勝の文をやめ、三好市観光協会 spot/53 の小歩危の話（大歩危の約3km下流、構えは小さいが岩肌の美しさは劣らない）にする
 *   ② かずら橋: 書き出しのレンタカーの文の言い回しを変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-189c-789cfdef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "789cfdef-1580-4fda-ada3-4bc8709e05a9";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "大歩危峡観光遊覧船（昼食と遊覧）",
    from: "大歩危小歩危は、結晶片岩が水に削られてできた峡谷で、国の天然記念物と名勝に指定されています。",
    to: "大歩危から約3km下流の小歩危は、谷の構えこそ小さいものの、奇岩や岩肌の美しさは大歩危に劣らないといわれます。",
  },
  {
    name: "祖谷のかずら橋",
    from: "JR阿波池田駅の近くでレンタカーを借りて、車で約1時間の西祖谷へ。",
    to: "JR阿波池田駅のそばでレンタカーを用意し、山あいの道を約1時間走って西祖谷へ向かいます。",
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
