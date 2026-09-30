/**
 * #269飯盛山と白虎隊(28ec8b18)の続き。制作補助2の気づき(企画運営2026-10-01
 * 00:19経由)。白虎隊記念館の座標(37.510349,139.943542)が、OSM上の実際の
 * 建物(way 215188469, 37.504513,139.9532878)から約1km北西にずれていた。
 * 正しい座標に直し、実際の距離(飯盛山から約253m=徒歩3分、旧の1321m=17分
 * という誤った値だった)にあわせて前後の移動時間・時刻をすべて再計算した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-269d-28ec8b18.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "28ec8b18-c34e-4f95-a166-830976a70133";

async function main() {
  const kinenkan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "白虎隊記念館" },
  });
  if (kinenkan.lat?.toString() === "37.510349") {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: kinenkan.id },
      {
        lat: 37.504513,
        lng: 139.9532878,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 8)),
        transitMode: "walk",
        transitDurationMin: 3,
      }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: kinenkan.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: kinenkan.id, orderNo: 1, transitMode: "walk", transitDurationMin: 3 },
    });
  }

  const cascade: [string, number, number][] = [
    ["鶴ヶ城", 11, 48],
    ["七日町通り", 13, 49],
    ["阿弥陀寺", 14, 24],
    ["会津武家屋敷", 14, 57],
  ];
  for (const [name, h, min] of cascade) {
    const s = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name } });
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, h, min)) });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
