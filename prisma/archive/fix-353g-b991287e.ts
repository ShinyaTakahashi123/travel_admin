/**
 * #353の続き。法務15:14の指摘: 相倉集落の座標36.430688,136.914051は、
 * OSMの大字(地名)の点(node 8959032959、place=neighbourhood「相倉」)で、
 * 集落そのものから約1.9km西にずれていた。法務が示した集落本来の点
 * (node 4485300889「越中五箇山相倉集落」、36.4261770,136.9355622)に修正。
 * 座標の変更に伴い、相倉→道の駅白川郷の移動時間も26分→29分に修正
 * (菅沼→相倉は偶然ほぼ同じ9分のまま)。75分だった相倉の滞在を70分に
 * わずかに調整し、1日目の終わりを16:30〜17:00の窓内(16:56)に収めた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353g-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b991287e-ca74-46a8-a190-55ce8cd37fe0";

async function main() {
  const ainokura = await prisma.spot.findFirstOrThrow({ where: { name: "相倉集落", day: { itineraryId: ITIN_ID } } });
  const michinoeki = await prisma.spot.findFirstOrThrow({ where: { name: "道の駅白川郷", day: { itineraryId: ITIN_ID } } });

  if (ainokura.lat?.toString().startsWith("36.4261")) {
    console.log("already applied, skipping");
    return;
  }

  const michinoekiOld = "相倉集落を見学したら、車でおよそ26分の道の駅白川郷へ向かいましょう。";
  const michinoekiNext = "相倉集落を見学したら、車でおよそ29分の道の駅白川郷へ向かいましょう。";
  if (!michinoeki.memo?.includes(michinoekiOld)) throw new Error("道の駅白川郷: anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: ainokura.id }, {
    lat: 36.426177,
    lng: 136.9355622,
    stayDurationMin: 70,
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: michinoeki.id }, {
    memo: michinoeki.memo!.replace(michinoekiOld, michinoekiNext),
    visitTime: new Date(Date.UTC(1970, 0, 1, 16, 26)),
    transitDurationMin: 29,
  });

  console.log("相倉集落の座標を正しいOSM点に修正、道の駅への移動時間を29分に、相倉の滞在を70分に調整");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
