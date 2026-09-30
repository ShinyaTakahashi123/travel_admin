/**
 * #336の続き。itinerary-audit.cjsの指摘に対応。
 *
 * 1) 温泉寺・まんだら湯への移動は、実際には徒歩なのに transitMode が
 *    "other" のままだったため、「近いのにother」の警告が出ていた。walkに直す。
 * 2) 一の湯への移動(まんだら湯から、昼食をはさんで40分)は、実際の徒歩だけなら
 *    もっと短いため、「徒歩が遅すぎ(水増し?)」と誤検知されていた。昼食を
 *    はさむことを示す other に変更(本文はすでに「昼食をはさみ」と明記済み)。
 * 3) 出石永楽館への移動(出石明治館から)が、0.5kmを3分は速すぎたため、
 *    実際の徒歩ペースに合わせて6分に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-336b-9d31758b.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d31758b-13cf-4d8c-bbdd-87a0361b36db";

async function main() {
  const onsenji = await prisma.spot.findFirstOrThrow({ where: { name: "温泉寺（城崎）", day: { itineraryId: ITIN_ID } } });
  if (onsenji.transitMode !== "walk") {
    await updateSpotInItinerary(ITIN_ID, { spotId: onsenji.id }, { transitMode: "walk" });
    console.log("onsenji transitMode -> walk");
  } else {
    console.log("onsenji already walk");
  }

  const mandarayu = await prisma.spot.findFirstOrThrow({ where: { name: "まんだら湯", day: { itineraryId: ITIN_ID } } });
  if (mandarayu.transitMode !== "walk") {
    await updateSpotInItinerary(ITIN_ID, { spotId: mandarayu.id }, { transitMode: "walk" });
    console.log("mandarayu transitMode -> walk");
  } else {
    console.log("mandarayu already walk");
  }

  const ichinoyu = await prisma.spot.findFirstOrThrow({ where: { name: "一の湯", day: { itineraryId: ITIN_ID } } });
  if (ichinoyu.transitMode !== "other") {
    await updateSpotInItinerary(ITIN_ID, { spotId: ichinoyu.id }, { transitMode: "other" });
    console.log("ichinoyu transitMode -> other");
  } else {
    console.log("ichinoyu already other");
  }

  const eirakukan = await prisma.spot.findFirstOrThrow({ where: { name: "出石永楽館", day: { itineraryId: ITIN_ID } } });
  const eirakukanTime = new Date(Date.UTC(1970, 0, 1, 15, 49));
  if (eirakukan.transitDurationMin !== 6 || eirakukan.visitTime?.getTime() !== eirakukanTime.getTime()) {
    await updateSpotInItinerary(ITIN_ID, { spotId: eirakukan.id }, { transitDurationMin: 6, visitTime: eirakukanTime });
    console.log("eirakukan transitDurationMin -> 6, visitTime -> 15:49");
  } else {
    console.log("eirakukan already fixed");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
