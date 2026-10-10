/**
 * #319の続き(自己チェック、企画運営の決まり8の指摘パターンを先取りして修正)。
 * 鉄道博物館→大宮盆栽美術館だけ「車でおよそ15分」で、日のほかの区間が
 * すべて徒歩だった(#318で企画運営に指摘された「車が浮いている」と同じ形)。
 * 直線距離はおよそ1.6kmで徒歩でも無理のない距離のため、車をやめて徒歩
 * (およそ20分)に統一する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-319c-7d80c940.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7d80c940-0507-41af-8688-ccb64b79a0a1";

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "鉄道博物館" },
  });
  {
    const old = "続いては、車でおよそ15分の大宮盆栽美術館へ向かいましょう。";
    const next = "続いては、歩いておよそ20分の大宮盆栽美術館へ向かいましょう。";
    if (museum.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: museum.memo.replace(old, next) });
    }
  }

  const bonsai = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大宮盆栽美術館" },
  });
  if (bonsai.transitMode === "car") {
    const old = "鉄道博物館からは車でおよそ15分です。";
    const next = "鉄道博物館からは歩いておよそ20分です。";
    const memo = (bonsai.memo ?? "").replace(old, next);
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: bonsai.id },
      {
        memo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 50)),
        transitMode: "walk",
        transitDurationMin: 20,
      }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: bonsai.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: bonsai.id, orderNo: 1, transitMode: "walk", transitDurationMin: 20 },
    });

    // 鉄道博物館終了12:30+徒歩20分=12:50。旧12:45から5分ずれるため、
    // 後続もすべて5分繰り下げる
    const cascade: [string, number, number][] = [
      ["大宮公園", 14, 4],
      ["武蔵一宮氷川神社", 15, 23],
    ];
    for (const [name, h, min] of cascade) {
      const s = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name } });
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, h, min)) });
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
