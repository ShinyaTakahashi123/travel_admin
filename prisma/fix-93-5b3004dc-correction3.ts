/**
 * #93 上高地の訂正その3。法務の指摘で、
 * 1. 「〜てみてください」が4か所(明神池・徳沢・ウェストン碑・上高地ビジターセンター)
 *    残っていたため「〜てみましょう」に直す。
 * 2. 大正池の点が、昼食のスポット(バス停「大正池」)と同じ点だったため、池のway439471453の
 *    岸のnode5289748621(36.230882,137.619686、バス停から見て池の対岸側の岸の点)に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-93-5b3004dc-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-93-5b3004dc-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TAISHOIKE_ID = "26c82dcc-40d4-42ac-bf91-310d545fa2c9";
const MYOJINIKE_ID = "f3f98d97-a9a5-4f4f-86cb-98bd3f5b281b";
const TOKUSAWA_ID = "ad366c9c-ecfc-4020-9448-519e83acd6f6";
const WESTON_ID = "f708e440-2797-498c-b096-8751d6abc430";
const VISITOR_CENTER_ID = "163becc7-107f-41bf-89d5-21ab472e275f";

const MYOJINIKE_FIND = "この静寂の景色をゆっくりと眺めてみてください。";
const MYOJINIKE_REPLACE = "この静寂の景色をゆっくりと眺めてみましょう。";

const TOKUSAWA_FIND = "穂高連峰を望む広々とした草地で、山と静けさに包まれる時間を過ごしてみてください。";
const TOKUSAWA_REPLACE = "穂高連峰を望む広々とした草地で、山と静けさに包まれる時間を過ごしてみましょう。";

const WESTON_FIND = "梓川のほとりに静かにたたずむ碑を訪ね、日本アルプスを愛した先人に思いをはせてみてください。";
const WESTON_REPLACE = "梓川のほとりに静かにたたずむ碑を訪ね、日本アルプスを愛した先人に思いをはせてみましょう。";

const VISITOR_CENTER_FIND =
  "旅の締めくくりに、これまで歩いてきた明神池や穂高神社奥宮、徳沢や河童橋、そして穂高の山々の記憶を振り返りながら、展示をゆっくり見て回ってみてください。";
const VISITOR_CENTER_REPLACE =
  "旅の締めくくりに、これまで歩いてきた明神池や穂高神社奥宮、徳沢や河童橋、そして穂高の山々の記憶を振り返りながら、展示をゆっくり見て回ってみましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [myojinike, tokusawa, weston, visitorCenter] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: MYOJINIKE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TOKUSAWA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: WESTON_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: VISITOR_CENTER_ID } }),
  ]);

  for (const [label, text, find] of [
    ["明神池", myojinike.memo ?? "", MYOJINIKE_FIND],
    ["徳沢", tokusawa.memo ?? "", TOKUSAWA_FIND],
    ["ウェストン碑", weston.memo ?? "", WESTON_FIND],
    ["上高地ビジターセンター", visitorCenter.memo ?? "", VISITOR_CENTER_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に対象の文が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newMyojinikeMemo = myojinike.memo!.replace(MYOJINIKE_FIND, MYOJINIKE_REPLACE);
  const newTokusawaMemo = tokusawa.memo!.replace(TOKUSAWA_FIND, TOKUSAWA_REPLACE);
  const newWestonMemo = weston.memo!.replace(WESTON_FIND, WESTON_REPLACE);
  const newVisitorCenterMemo = visitorCenter.memo!.replace(VISITOR_CENTER_FIND, VISITOR_CENTER_REPLACE);

  console.log("=== #93 訂正その3 ===\n");
  console.log("大正池: 36.230882,137.619686(way439471453の岸のnode5289748621)");
  console.log("明神池:", newMyojinikeMemo.slice(-40));
  console.log("徳沢:", newTokusawaMemo.slice(-60));
  console.log("ウェストン碑:", newWestonMemo.slice(-50));
  console.log("ビジターセンター:", newVisitorCenterMemo.slice(-40));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: TAISHOIKE_ID }, data: { lat: 36.230882, lng: 137.619686 } }),
    prisma.spot.update({ where: { id: MYOJINIKE_ID }, data: { memo: newMyojinikeMemo } }),
    prisma.spot.update({ where: { id: TOKUSAWA_ID }, data: { memo: newTokusawaMemo } }),
    prisma.spot.update({ where: { id: WESTON_ID }, data: { memo: newWestonMemo } }),
    prisma.spot.update({ where: { id: VISITOR_CENTER_ID }, data: { memo: newVisitorCenterMemo } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
