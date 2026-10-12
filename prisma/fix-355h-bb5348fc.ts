/**
 * #355の続き。企画運営の指摘: 車は出雲大社の駐車場に停めたまま、神門通り・稲佐の浜・
 * 出雲阿国の墓までは徒歩で回っていたため、出雲阿国の墓から「車で旧大社駅へ」は
 * 誤り(先に駐車場まで歩いて戻る必要がある)。出雲阿国の墓の結びと旧大社駅の書き出しを
 * 直し、transitLegsも徒歩+車の2区間(#219と同じ形)にする。
 *
 * 出雲阿国の墓→出雲大社駐車場: 実距離約503m→徒歩7分
 * 出雲大社駐車場→旧大社駅: 実距離約1.53km→車8分
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355h-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";

async function main() {
  const okuni = await prisma.spot.findFirstOrThrow({ where: { name: "出雲阿国の墓", day: { itineraryId: ITIN_ID } } });
  const old1 = "見学を終えたら、車で旧大社駅へ向かいましょう。";
  const new1 = "見学を終えたら、出雲大社の駐車場まで歩いて戻り、車で旧大社駅へ向かいましょう。";
  if (!okuni.memo?.includes(old1)) throw new Error("出雲阿国の墓: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: okuni.id }, { memo: okuni.memo.replace(old1, new1) });

  const kyutaishaeki = await prisma.spot.findFirstOrThrow({ where: { name: "旧大社駅", day: { itineraryId: ITIN_ID } } });
  const old2 = "出雲阿国の墓から車で向かうのは旧大社駅です。";
  const new2 = "出雲大社の駐車場へ歩いて戻り、車でおよそ8分(あわせて約15分)の旧大社駅へ向かいます。";
  if (!kyutaishaeki.memo?.includes(old2)) throw new Error("旧大社駅: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: kyutaishaeki.id }, {
    memo: kyutaishaeki.memo.replace(old2, new2),
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 45)),
    transitLegs: {
      deleteMany: {},
      create: [
        { orderNo: 1, transitMode: "walk", transitDurationMin: 7 },
        { orderNo: 2, transitMode: "car", transitDurationMin: 8 },
      ],
    },
  });

  console.log("#355: 出雲阿国の墓→旧大社駅を徒歩(駐車場まで)+車の2区間に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
