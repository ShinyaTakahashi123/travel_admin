/**
 * #483 58d676cf の追いの直し（しおりえ(制作補助2)、企画運営 9/30 21:42 の指摘）
 *   1) 冬（12月〜3月）は吹屋の施設が早く閉まり、郷土館・ベンガラ館は開く日が限られ、笹畝坑道は予約制なので、季節から冬を外す（#88 と同じ扱い）。本文の冬の注意も消す
 *   2) 1か所目を「駅の近くでレンタカーを借りて」、帰りを「駅へ戻り、車を返しましょう」の形に
 *      駅前のレンタカー: https://www.r-toyota-oka.co.jp/s/store/detail.php?id=13 （備中高梁駅から駅前通り沿いに100m、9:00から。本文に店の名前は書かない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-483b-58d676cf.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "58d676cf-5880-4e4e-959d-39edf2a79d10";
const COMMIT = process.argv.includes("--commit");

const EDITS: { name: string; from: string; to: string }[] = [
  { name: "高梁市成羽美術館", from: "JR備中高梁駅から車で約20分の高梁市成羽美術館へ。", to: "JR備中高梁駅の近くでレンタカーを借りて、車で約20分の高梁市成羽美術館へ。" },
  { name: "旧片山家住宅・郷土館", from: "冬は郷土館の開く日が限られるので、公式の案内で確かめましょう。", to: "" },
  { name: "ベンガラ館", from: "冬は開く日が限られるので、公式の案内で確かめましょう。", to: "休館日は公式の案内で確かめましょう。" },
  { name: "笹畝坑道", from: "冬は見学できる日が限られ、予約が必要なので、公式の案内で確かめましょう。", to: "" },
  { name: "広兼邸", from: "12月から3月は閉まる時刻が早くなるので、公式の案内で確かめましょう。", to: "" },
  { name: "広兼邸", from: "帰りは、車で備中高梁駅へ約40分。", to: "帰りは、車で約40分の備中高梁駅へ戻り、車を返しましょう。" },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { seasons: true } });
  if (it.seasons.join() !== ["spring", "summer", "autumn", "winter"].join()) throw new Error(`季節が想定と違います: ${it.seasons}`);
  const memos = new Map<string, { id: string; memo: string }>();
  for (const e of EDITS) {
    if (!memos.has(e.name)) {
      const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: e.name });
      memos.set(e.name, { id: s.id, memo: s.memo ?? "" });
    }
    const cur = memos.get(e.name)!;
    if (!cur.memo.includes(e.from)) throw new Error(`${e.name} の本文が想定と違います`);
    cur.memo = cur.memo.replace(e.from, e.to);
  }
  for (const [name, v] of memos) console.log(`${name}: …${v.memo.slice(-90)}`);
  console.log("季節: spring,summer,autumn（冬を外す）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } });
    for (const v of memos.values()) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: v.id }, { memo: v.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
