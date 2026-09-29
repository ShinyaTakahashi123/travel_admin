/**
 * #390 eebd52df の追いの修正（しおりえ(制作補助2)、監査の警告への対応）
 * - 湯沢高原ロープウェイ: 「世界最大級のロープウェイで」→「世界最大級とされるロープウェイで」
 * - 湯沢高原パノラマパーク（滞在160分）: 過ごし方（ジップライン・マウンテンゴーカートなどの遊び、冬のスキー）を足す
 *   出典: 新潟県観光協会 https://niigata-kankou.or.jp/spot/6943
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-390b-eebd52df.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "eebd52df-4af9-478e-9f67-95784b9af2d2";
const COMMIT = process.argv.includes("--commit");

const EDITS = [
  { name: "湯沢高原ロープウェイ", old: "166人が乗れる世界最大級のロープウェイで、", new: "166人が乗れる世界最大級とされるロープウェイで、" },
  {
    name: "湯沢高原パノラマパーク",
    old: "冬はスキー場になり、雪をかぶった越後の山々を見渡せます。",
    new: "ジップラインやマウンテンゴーカートなど、体を動かす遊びもあります。冬はスキー場になり、雪をかぶった越後の山々を見渡せます。",
  },
];

async function main() {
  const plan = [];
  for (const e of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: e.name });
    if (!s.memo?.includes(e.old)) throw new Error(`${e.name}: 本文が想定と違います`);
    plan.push({ id: s.id, memo: s.memo.replace(e.old, e.new) });
    console.log(`${e.name}: ${e.new}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
