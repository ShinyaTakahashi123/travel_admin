/**
 * #363の続き。fix-363dで蔵王中央ロープウェイの座標を乗り場(温泉駅)に修正した
 * ことで、ドッコ沼までの道のりが「徒歩8分」のままでは実際の距離(山上の鳥兜駅
 * まで戻ってから歩く分も含め2.0km)に対して速すぎるという指摘を
 * itinerary-audit.cjsで発見。蔵王中央ロープウェイでの乗車(温泉駅→鳥兜駅、
 * 約8分)と、鳥兜駅からの徒歩(約8分)の2区間に分け、後続の時刻もずらす。
 *
 * 新しい時刻(09:00〜16:33、6か所):
 * 蔵王ロープウェイ(140)→昼食(60)→酢川温泉神社(25)→蔵王中央ロープウェイ(60)
 * →ドッコ沼(35)→蔵王温泉大露天風呂(60)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363e-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "ca4cf898-7e26-4db6-89da-0d1af4d45c81";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const dokkonuma = await prisma.spot.findFirstOrThrow({ where: { name: "ドッコ沼", day: { itineraryId: ITIN_ID } } });
  if (dokkonuma.visitTime?.toISOString().slice(11, 16) === "14:38") {
    console.log("既に対応済み");
    return;
  }
  const oldOpen = "蔵王中央ロープウェイから歩いて8分ほど、次に訪れるのはドッコ沼です。";
  const newOpen = "蔵王中央ロープウェイで鳥兜駅まで上り、そこから歩いて8分ほど、次に訪れるのはドッコ沼です。";
  const newMemo = dokkonuma.memo?.includes(oldOpen) ? dokkonuma.memo.replace(oldOpen, newOpen) : dokkonuma.memo;
  await updateSpotInItinerary(ITIN_ID, { spotId: dokkonuma.id }, {
    memo: newMemo,
    visitTime: T(14, 38),
    transitLegs: {
      deleteMany: {},
      create: [
        { orderNo: 1, transitMode: "other", transitDurationMin: 8, transitLine: "蔵王中央ロープウェイ" },
        { orderNo: 2, transitMode: "walk", transitDurationMin: 8 },
      ],
    },
  });
  console.log("ドッコ沼: 温泉駅→鳥兜駅のロープウェイ乗車と、鳥兜駅からの徒歩の2区間に分割、到着時刻を修正");

  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王温泉大露天風呂", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: rotenburo.id }, {
    visitTime: T(15, 33),
    stayDurationMin: 60,
  });
  console.log("蔵王温泉大露天風呂: 到着時刻を15:33に、滞在を60分に修正");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
