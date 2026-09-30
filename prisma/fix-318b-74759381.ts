/**
 * #318の続き(自己チェックの気づき)。
 * fix-318で九谷焼窯跡展示館のmemoは直したが、setDaySpotOrderの呼び出しで
 * visitTime・stayDurationMin・transitDurationMinを渡し忘れ、古い値(10:50・
 * 50分・移動15分=旧・古総湯からの直行の値)のまま残っていた(itinerary-auditの
 * 「時刻の計算が合わない」で検出)。いろは草庵からの実際の値(11:10開始・
 * 60分滞在・徒歩12分)に修正。後続の石川県九谷焼美術館は作成時点から
 * 正しい値(12:25開始)だったため、この1件の修正だけで整合する。
 *
 * あわせて、江沼神社に配慮の一文がないとprayer-check.cjsで検出されたため
 * (建物の外観の説明のみで、神社そのものへの一文が抜けていた)、
 * 「境内では静かに、敬意をもってお参りください。」を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-318b-74759381.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74759381-8ba1-4cc4-af19-4c1c523341be";

async function main() {
  const kilnMuseum = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "九谷焼窯跡展示館" },
  });
  if (kilnMuseum.visitTime?.getUTCHours() === 10 && kilnMuseum.visitTime?.getUTCMinutes() === 50) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: kilnMuseum.id },
      {
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 10)),
        stayDurationMin: 60,
        transitDurationMin: 12,
      }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: kilnMuseum.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: kilnMuseum.id, orderNo: 1, transitMode: "walk", transitDurationMin: 12 },
    });
  }

  const enuma = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "江沼神社" },
  });
  const old = "江戸時代中期の趣きある建物を、外から静かに眺めてみましょう。続いては、";
  const next = "江戸時代中期の趣きある建物を、外から静かに眺めてみましょう。境内では静かに、敬意をもってお参りください。続いては、";
  if (enuma.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: enuma.id }, { memo: enuma.memo.replace(old, next) });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
