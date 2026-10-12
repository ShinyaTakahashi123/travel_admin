/**
 * #226 e4f374cb の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * ①「大歩危峡まんなか」は宿の名前なので、スポット名を「大歩危峡の遊覧船」にし、次のスポットの書き出しからも外す（座標は乗り場の点としてそのまま）
 * ② かずら橋「日本三奇橋のひとつに数えられ」→「ひとつとされ」
 * ③ 箸蔵山ロープウェイ「日本で初めての方式で架けられた」→「架けられたとされる」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-226c-e4f374cb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "e4f374cb-4d71-42af-8aff-c698e55962e2";
const COMMIT = process.argv.includes("--commit");
const EDITS: { name: string; rename?: string; from?: string; to?: string }[] = [
  { name: "大歩危峡まんなか", rename: "大歩危峡の遊覧船" },
  { name: "道の駅大歩危 妖怪屋敷と石の博物館", from: "大歩危峡まんなかから歩いて約5分。", to: "遊覧船の乗り場から歩いて約5分。" },
  { name: "祖谷のかずら橋", from: "日本三奇橋のひとつに数えられ、", to: "日本三奇橋のひとつとされ、" },
  { name: "箸蔵寺", from: "日本で初めての方式で架けられたロープウェイで、", to: "日本で初めての方式で架けられたとされるロープウェイで、" },
];

async function main() {
  const ops = [];
  for (const e of EDITS) {
    const spots = await prisma.spot.findMany({ where: { name: e.name, day: { itineraryId: ITINERARY_ID } } });
    if (spots.length !== 1) throw new Error(`${e.name}: 見つかりません`);
    const memo = spots[0].memo ?? "";
    if (memo.includes("まんなか") && !e.from) throw new Error(`${e.name}: 本文に宿の名前があります`);
    if (e.from && !memo.includes(e.from)) throw new Error(`${e.name}: 本文が想定と違います`);
    const data = { ...(e.rename ? { name: e.rename } : {}), ...(e.from ? { memo: memo.replace(e.from, e.to!) } : {}) };
    console.log(`${e.name}${e.rename ? ` → ${e.rename}` : ""}${data.memo ? `\n${data.memo}` : ""}\n`);
    ops.push(prisma.spot.update({ where: { id: spots[0].id }, data }));
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ops);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
