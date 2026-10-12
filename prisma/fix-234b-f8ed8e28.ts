/**
 * #234 f8ed8e28 の移動の直し（しおりえ(制作補助2)）
 * 五百羅漢→呉羽山公園展望台は約0.5kmなので、「歩き＋車 15分」→「歩いて約10分」にする（展望台を15:40から50分に）。帰りは民芸村の駐車場へ歩いて戻る
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-234b-f8ed8e28.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "f8ed8e28-a91b-4a49-b95a-9df98e7a2ecb";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const EDITS = [
  { from: "五百羅漢から車へ歩いて戻り、車で約5分（あわせて約15分）。", to: "五百羅漢から坂を上って、歩いて約10分。" },
  { from: "帰りは、車で約15分の富山駅の近くでレンタカーを返しましょう。", to: "帰りは民俗民芸村の駐車場へ歩いて戻り、車で約15分の富山駅の近くでレンタカーを返しましょう。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "呉羽山公園展望台" } });
  if (spots.length !== 1) throw new Error("構成が想定と違います");
  let memo = spots[0].memo ?? "";
  for (const e of EDITS) {
    if (!memo.includes(e.from)) throw new Error(`本文が想定と違います: ${e.from}`);
    memo = memo.replace(e.from, e.to);
  }
  console.log(`15:40 滞在50分 walk10\n${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: spots[0].id }, data: { visitTime: t(15, 40), stayDurationMin: 50, memo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] } } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
