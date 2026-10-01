/**
 * #343の続き。itinerary-auditで徒歩が速すぎる(walk-too-fast)の指摘が2件。
 * 群馬の森公園(歴史博物館から0.4kmを3分)→5分に、群馬県立近代美術館
 * (綿貫観音山古墳から1.0kmを3分、距離の見積もりを誤っていた)→12分に直し、
 * 後続のvisitTimeも合わせて再計算する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-343d-a4ee710d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd";

const IDS = {
  park: "8febf205-9a13-4819-a2a9-f3bb003cf3b9",
  kofun: "1bd026e0-ac63-4fb9-ab47-96d44ce08697",
  museum: "4d3aa6bc-3b9c-4d01-83d1-d21aabd8f7dc",
  yamanoue: "0dd54bba-c9fc-4b42-b1f4-3a6e9c170d98",
  kanaizawa: "fb235744-2dba-42fb-bd3b-c9aad2d0a5dd",
  tago: "17661187-e50b-40fa-bf37-bca89b4611b8",
};

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const park = await prisma.spot.findFirstOrThrow({ where: { id: IDS.park } });
  if (park.transitDurationMin === 5) {
    console.log("already fixed, skipping");
    return;
  }
  const museumSpot = await prisma.spot.findFirstOrThrow({ where: { id: IDS.museum } });

  const parkOld = "群馬県立歴史博物館からは、歩いておよそ3分です。";
  const parkNext = "群馬県立歴史博物館からは、歩いておよそ5分です。";
  if (!park.memo?.includes(parkOld)) throw new Error("park anchor not found");

  const museumOld = "綿貫観音山古墳からは、歩いておよそ3分です。";
  const museumNext = "綿貫観音山古墳からは、歩いておよそ12分です。";
  if (!museumSpot.memo?.includes(museumOld)) throw new Error("museum anchor not found");

  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: IDS.park },
    { transitDurationMin: 5, visitTime: t(10, 50), memo: park.memo.replace(parkOld, parkNext) }
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: IDS.kofun }, { visitTime: t(11, 57) });
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: IDS.museum },
    { transitDurationMin: 12, visitTime: t(12, 54), memo: museumSpot.memo.replace(museumOld, museumNext) }
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: IDS.yamanoue }, { visitTime: t(14, 34) });
  await updateSpotInItinerary(ITIN_ID, { spotId: IDS.kanaizawa }, { visitTime: t(15, 4) });
  await updateSpotInItinerary(ITIN_ID, { spotId: IDS.tago }, { visitTime: t(15, 39) });

  console.log("transit times and visitTime cascade fixed");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
