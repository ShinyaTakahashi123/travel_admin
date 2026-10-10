/**
 * チェックリスト #303 の修正記録(セルフチェックで発見)。
 * しおり「清水寺と八坂神社、東福寺と伏見稲荷大社をめぐり御朱印をいただく
 * 京都1泊2日」(5bb2acee-21b8-4703-97e7-8ba1d3d4988c)
 *
 * itinerary-audit.cjsで、円山公園・知恩院・京都鉄道博物館の言い切り表現
 * (決まり9)を検出したため「とされ」でヘッジ。flow-check.cjsで、2日目に
 * 昼食の一言がないことを検出したため、伏見稲荷大社に追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-303b-5bb2acee.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "5bb2acee-21b8-4703-97e7-8ba1d3d4988c";

async function main() {
  const maruyama = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "円山公園" } });
  if (maruyama.memo?.includes("京都市内で最も古い公園です。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: maruyama.id }, {
      memo: maruyama.memo.replace("京都市内で最も古い公園です。", "京都市内で最も古い公園とされています。"),
    });
  }

  const chionin = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "知恩院" } });
  if (chionin.memo?.includes("日本最大級の木造の門です。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: chionin.id }, {
      memo: chionin.memo.replace("日本最大級の木造の門です。", "日本最大級の木造の門とされています。"),
    });
  }

  const museum = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "京都鉄道博物館" } });
  if (museum.memo) {
    const fixed = museum.memo
      .replace("日本最大級の鉄道博物館です。", "日本最大級の鉄道博物館とされています。")
      .replace("現存する日本最古の鉄筋コンクリート造りの車庫で、", "現存する日本最古の鉄筋コンクリート造りの車庫とされ、");
    if (fixed !== museum.memo) {
      await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: fixed });
    }
  }

  const fushimi = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "伏見稲荷大社" } });
  const lunchAnchor = "参拝のあとは、電車で東寺方面へ向かいましょう。";
  const lunchLine = "参道沿いには、いなり寿司などの食事処も多いので、ここで昼食をとりましょう。";
  if (fushimi.memo?.includes(lunchAnchor) && !fushimi.memo.includes(lunchLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: fushimi.id }, {
      memo: fushimi.memo.replace(lunchAnchor, `${lunchLine} ${lunchAnchor}`),
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
