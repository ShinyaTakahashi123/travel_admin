/**
 * #363の続き。法務の参考指摘: 大露天風呂の書き出し「…温泉駅まで下りて歩くこと、
 * 旅の最後に訪れるのは…」は文がつながっていないため、「…下りたら、」に修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-363g-ca4cf898.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "ca4cf898-7e26-4db6-89da-0d1af4d45c81";

async function main() {
  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王温泉大露天風呂", day: { itineraryId: ITIN_ID } } });
  const old = "ドッコ沼から鳥兜駅へ歩いて戻り、蔵王中央ロープウェイで温泉駅まで下りて歩くこと、旅の最後に訪れるのは蔵王温泉大露天風呂です。";
  const next = "ドッコ沼から鳥兜駅へ歩いて戻り、蔵王中央ロープウェイで温泉駅まで下りたら、旅の最後に訪れるのは蔵王温泉大露天風呂です。";
  if (rotenburo.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: rotenburo.id }, { memo: rotenburo.memo.replace(old, next) });
    console.log("蔵王温泉大露天風呂: 書き出しの文のつながりを修正");
  } else {
    console.log("既に対応済み");
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
