/**
 * #351の続き。自己チェックでitinerary-auditを再確認したところ、山寺芭蕉記念館と
 * 大石田町立歴史民俗資料館の休館日の案内(「月曜(祝日の場合は翌日)」「祝日の翌日」
 * 「年末年始」)が、決まり9(閉館・休館の曜日や日程は本文に書かない)に反する
 * 表現だったため、「休館日があるため、訪れる前に公式サイトで確かめておきましょう。」
 * という曜日・日付を含まない案内に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351b-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b461a3e0-87c6-48dd-b5e8-886ba0345df7";

async function main() {
  const basho = await prisma.spot.findFirstOrThrow({ where: { name: "山寺芭蕉記念館", day: { itineraryId: ITIN_ID } } });
  const oishida = await prisma.spot.findFirstOrThrow({ where: { name: "大石田町立歴史民俗資料館", day: { itineraryId: ITIN_ID } } });

  const bashoOld = "月曜(祝日の場合は翌日)と年末年始は休館のため、訪れる前に公式サイトで確かめておきましょう。";
  const bashoNext = "休館日があるため、訪れる前に公式サイトで確かめておきましょう。";
  if (basho.memo?.includes(bashoOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: basho.id }, { memo: basho.memo.replace(bashoOld, bashoNext) });
    console.log("山寺芭蕉記念館: 休館日の案内を修正");
  } else if (basho.memo?.includes(bashoNext)) {
    console.log("山寺芭蕉記念館: already fixed, skipping");
  } else {
    throw new Error("山寺芭蕉記念館: anchor not found");
  }

  const oishidaOld = "月曜(祝日の場合は翌日)、祝日の翌日、年末年始は休館のため、訪れる前に公式サイトで確かめておきましょう。";
  const oishidaNext = "休館日があるため、訪れる前に公式サイトで確かめておきましょう。";
  if (oishida.memo?.includes(oishidaOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: oishida.id }, { memo: oishida.memo.replace(oishidaOld, oishidaNext) });
    console.log("大石田町立歴史民俗資料館: 休館日の案内を修正");
  } else if (oishida.memo?.includes(oishidaNext)) {
    console.log("大石田町立歴史民俗資料館: already fixed, skipping");
  } else {
    throw new Error("大石田町立歴史民俗資料館: anchor not found");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
