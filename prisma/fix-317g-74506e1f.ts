/**
 * #317の続き(企画運営2026-09-30 21:30 JSTの指摘)。
 * fix-317fで神倉神社に足した「昨夜の湯の峰温泉の宿から、車でおよそ25分」が誤り。
 * 根拠にしたWebSearchの要約が、実際には新宮駅⇔湯の峰温泉の区間ではない値
 * (特急南紀の新宮発時刻など)を「バスで26分」と取り違えていた。
 *
 * 実際に湯の峰温泉〔奈交〕から新宮駅までのバス時刻表(特急301・302 八木新宮線
 * [奈良交通])を確認したところ、所要73〜75分(14:34発73分・17:09発75分・19:09発73分)
 * だった。直線距離もおよそ24.7km(湯の峰33.8288523,135.7575690 ⇔ 新宮駅
 * 33.7256066,135.9941506)で、国道168号沿いの山道であることを踏まえると、
 * 新宮駅⇔熊野本宮大社(hongu.jp公式で35km・約1時間)とほぼ同等かそれ以上の道のり。
 * 車はバスより停車がない分いくらか速いと見て、「車でおよそ1時間」に訂正する
 * (企画運営の指摘どおり)。2日目の時刻表の9:00表示はそのまま変えない。
 *
 * 出典:
 * - https://www.navitime.co.jp/bus/diagram/timelist?departure=00032496&arrival=00031552&line=00009836
 *   (湯の峰温泉〔奈交〕→新宮駅、特急301・302八木新宮線、所要73〜75分)
 * - https://www.hongu.jp/access/to-hongu/car/ (新宮市街地35km・約1時間、比較の目安)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317g-74506e1f.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  const kamikura = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "神倉神社" },
  });
  const old =
    "この旅は、新宮駅で借りたレンタカーと徒歩を使い分けてめぐります。昨夜の湯の峰温泉の宿から、車でおよそ25分。神倉神社は、";
  const next =
    "この旅は、新宮駅で借りたレンタカーと徒歩を使い分けてめぐります。昨夜の湯の峰温泉の宿から、車でおよそ1時間。神倉神社は、";
  if (kamikura.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kamikura.id }, { memo: kamikura.memo.replace(old, next) });
  } else if (!kamikura.memo?.includes(next)) {
    throw new Error("神倉神社のmemoが想定と異なります。現在の内容を確認してください。");
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
