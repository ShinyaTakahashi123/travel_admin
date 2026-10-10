/**
 * #491 3155fabf の追いの直し（しおりえ(制作補助2)、2026-10-01 法務・企画運営の指摘）
 * - 千畳閣・五重塔（宮島で最初に歩き始める所）に、野生のシカへの一文（法務の文例どおり。奈良と同じ扱い）
 * - 広島城: 「令和8年（2026年）3月に閉城し」の年月を書かない形に。広島城公式 https://hiroshimacastle.jp/ 「2026年3月に閉城しました。外観の鑑賞は可能です。」を確認
 * - 季節が空だったので、春・夏・秋・冬（しまなみのレンタサイクル・瀬戸田の船・宮島・広島とも冬も成り立つ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-491b-3155fabf.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "3155fabf-7e37-4803-9bdb-66a7c7dc732a";
const COMMIT = process.argv.includes("--commit");
const FIXES: { dayNumber: number; spotName: string; o: string; n: string }[] = [
  { dayNumber: 4, spotName: "千畳閣・五重塔", o: "海沿いを厳島神社の方へ歩きます。", n: "海沿いを厳島神社の方へ歩きます。島のシカは野生です。えさをあげたり、さわったりせず、紙や食べ物をとられないよう気をつけましょう。" },
  { dayNumber: 3, spotName: "広島城", o: "原爆で倒壊した天守は昭和33年（1958年）に鉄筋コンクリートで再建されましたが、老朽化のため令和8年（2026年）3月に閉城し、今は外観だけを見学できます。", n: "原爆で倒壊した天守は昭和33年（1958年）に鉄筋コンクリートで再建されました。今は天守の中には入れず、外観を見学します（最新の情報は公式の案内で確かめましょう）。" },
];

async function main() {
  const rows: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const f of FIXES) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: f.dayNumber, spotName: f.spotName });
    if (!s.memo?.includes(f.o)) throw new Error(`本文が想定と違います: ${f.spotName}`);
    const memo = s.memo.replace(f.o, f.n);
    console.log(`\n■ ${f.spotName}\n${memo}`);
    rows.push({ id: s.id, dayNumber: f.dayNumber, memo });
  }
  console.log("\n季節: spring, summer, autumn, winter");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn", "winter"] } });
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: r.dayNumber, spotId: r.id }, { memo: r.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
