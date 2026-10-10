/**
 * #324の続き。法務2026-10-01 00:57の2点。
 * 1. 中津城「『日本三大水城』の一つに数えられています」→「…一つとも
 *    いわれ」に(#307高松城と同じ書き方、定まった呼び名ではないため)。
 * 2. 大江医家史料館「全身麻酔による乳がん摘出手術を初めて成功させた
 *    華岡青洲」→「…初めて成功させたとされる華岡青洲」に。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-324c-84eb50c0.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "84eb50c0-577b-428d-9200-80b8a8f2fedb";

async function main() {
  const nakatsujo = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "中津城" },
  });
  {
    const old = "高松城、今治城とあわせて「日本三大水城」の一つに数えられています。";
    const next = "高松城、今治城とあわせて「日本三大水城」の一つともいわれています。";
    if (nakatsujo.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: nakatsujo.id }, { memo: nakatsujo.memo.replace(old, next) });
    }
  }

  const oe = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大江医家史料館" },
  });
  {
    const old = "全身麻酔による乳がん摘出手術を初めて成功させた華岡青洲ゆかりの医療資料";
    const next = "全身麻酔による乳がん摘出手術を初めて成功させたとされる華岡青洲ゆかりの医療資料";
    if (oe.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: oe.id }, { memo: oe.memo.replace(old, next) });
    }
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
