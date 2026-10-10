/**
 * チェックリスト #292 の修正記録(見直しの続き、flow-check.cjsの6点自己チェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * flow-check.cjsで、次の4点が既存の課題として見つかった(いずれも今回の窓の直しとは
 * 別に、以前から抜けていたもの。6点の自己チェックにもとづき、あわせて直した):
 *
 * 1. Day1に昼食の一言がなかった。高湯通り(温泉街のメインストリート、旅館・土産店が
 *    並ぶ)に、周辺の飲食店で昼食をとる一言を追加。
 * 2. Day1の最後(下湯共同浴場)に宿の一言がなかった。Day2も蔵王温泉大露天風呂から
 *    始まる(=同じ蔵王温泉に宿泊)ため、「今夜は蔵王温泉に宿泊しましょう。」を追加。
 * 3. Day2に昼食の一言がなかった。どっこ沼のほとりにブナ林の中のテーブル・椅子で
 *    昼食をとれる旨が山形県公式観光サイトに記載されているため、その一言を追加。
 *    出典: https://yamagatakanko.com/attractions/detail_12296.html
 *    「ドッコ沼畔には、ブナ林のなかにテーブルや椅子があり、昼食をとったり、
 *    昼寝をしたり、のんびりとくつろぐことができます。」
 * 4. Day2の最後(上湯・川原湯共同浴場)に帰りの一言がなかった。追加。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292b-44c030d6.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const takayu = await findSpotInItinerary(ITIN_ID, { spotName: "高湯通り" });
  const takayuRow = await prisma.spot.findUniqueOrThrow({ where: { id: takayu.id } });
  const lunchLine1 = "通り沿いには飲食店も並んでいるので、ここで昼食をとりましょう。";
  if (takayuRow.memo && !takayuRow.memo.includes(lunchLine1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: takayu.id }, { memo: takayuRow.memo + " " + lunchLine1 });
  }

  const shimoyu = await findSpotInItinerary(ITIN_ID, { spotName: "下湯共同浴場" });
  const shimoyuRow = await prisma.spot.findUniqueOrThrow({ where: { id: shimoyu.id } });
  const yadoLine = "今夜は蔵王温泉に宿泊しましょう。";
  if (shimoyuRow.memo && !shimoyuRow.memo.includes(yadoLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shimoyu.id }, { memo: shimoyuRow.memo + " " + yadoLine });
  }

  const dokko = await findSpotInItinerary(ITIN_ID, { spotName: "どっこ沼" });
  const dokkoRow = await prisma.spot.findUniqueOrThrow({ where: { id: dokko.id } });
  const lunchLine2 = "沼のほとりにはブナ林の中にテーブルや椅子があり、ここで昼食をとることもできます。";
  if (dokkoRow.memo && !dokkoRow.memo.includes(lunchLine2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: dokko.id }, { memo: dokkoRow.memo + " " + lunchLine2 });
  }

  const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
  const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
  const kaeriLine = "湯めぐりを終えたら、車や公共交通で山形市街・山形空港方面へ戻りましょう。";
  if (kyodoRow.memo && !kyodoRow.memo.includes(kaeriLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, { memo: kyodoRow.memo + " " + kaeriLine });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
