/**
 * チェックリスト #286 の修正記録(見直し)。
 * しおり「宮崎神宮とフローランテ宮崎、緑と花に包まれる1泊2日」
 * (3d13f9de-a522-4db3-ac1d-35778ac017f1)
 *
 * 本番でDay1が開始10:00(決まり2の8:30〜9:30に違反)・終了15:56、Day2が終了16:04と、
 * 決まり2に届いていないことが判明。ユーザーの方針(「近くに実在の行き先が足りない」は
 * 例外にしない)にもとづき、実在するスポットを追加・調整(直接開いたURLで確認):
 *
 * Day1: 開始を10:00→09:00に修正。宮崎神宮と宮崎県護国神社の間に、宮崎県総合博物館
 * (新規、宮崎神宮の杜に隣接。昭和26年[1951]に県立博物館として開館、昭和46年[1971]に
 * 自然史・歴史・民俗の3部門を統合。敷地内の民家園には昭和47〜53年[1972-1978]に
 * 移築された4棟の伝統的民家。Wikipedia https://ja.wikipedia.org/wiki/宮崎県総合博物館
 * で確認。写真1件取得・目視確認済み)を追加。橘公園の滞在を45→55分に調整(既存の
 * 「川沿いの散歩道を、のんびりと歩いてみましょう」の内容にあわせて)。
 *
 * Day2: 青島神社の滞在を45→75分に調整(既存の本文で「鬼の洗濯板」を島を歩いて見る
 * 内容が既に含まれているため、実際に過ごせる長さにあわせて延長)。
 *
 * 結果、Day1は09:00〜16:31、Day2は09:30〜16:34、いずれも窓内。
 * itinerary-audit.cjs・prayer-check.cjs 確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-286-3d13f9de.ts
 * (実行済み。新スポットの有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import * as fs from "fs";
import * as path from "path";

const ITIN_ID = "3d13f9de-a522-4db3-ac1d-35778ac017f1";
const cachePath = path.join(__dirname, "photo-cache.json");
const creditPath = path.join(__dirname, "photo-credit-cache.json");

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (!day1.spots.some((s) => s.name === "宮崎県総合博物館")) {
    const imageCache = new Map<string, string | null>(Object.entries(JSON.parse(fs.readFileSync(cachePath, "utf8"))));
    const creditCache = new Map<string, any>(Object.entries(JSON.parse(fs.readFileSync(creditPath, "utf8"))));
    const photoUrl = await fetchAndUploadImage(
      imageCache,
      { name: "宮崎県総合博物館", wikiTitle: "宮崎県総合博物館" } as any,
      "official-areas-09",
      creditCache
    );
    fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(imageCache), null, 2) + "\n");
    fs.writeFileSync(creditPath, JSON.stringify(Object.fromEntries(creditCache), null, 2) + "\n");
    console.log("photo:", photoUrl);

    const jingu = day1.spots.find((s) => s.name === "宮崎神宮")!;
    const gokoku = day1.spots.find((s) => s.name === "宮崎県護国神社")!;
    const bunka = day1.spots.find((s) => s.name === "宮崎県総合文化公園")!;
    const bijutsukan = day1.spots.find((s) => s.name === "宮崎県立美術館")!;
    const heiwadai = day1.spots.find((s) => s.name === "平和台公園")!;
    const tachibana = day1.spots.find((s) => s.name === "橘公園")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day1.id,
        [
          { id: jingu.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)) } },
          {
            create: {
              name: "宮崎県総合博物館",
              address: "宮崎市神宮2丁目4-4",
              lat: 31.9400272,
              lng: 131.4237708,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 3)),
              stayDurationMin: 80,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "宮崎神宮からは歩いて3分ほどです。宮崎県総合博物館は、宮崎神宮の杜に隣接する県立の博物館です。昭和26年(1951)に宮崎県立博物館として開館し、昭和46年(1971)、自然史・歴史・民俗の3部門を統合した総合博物館として今の姿になりました。自然史展示室では宮崎の森や水辺の生き物を、歴史展示室では旧石器時代から現代までの暮らしを、民俗展示室では山・里・海の暮らしや祈り・祭りを紹介しています。敷地内の民家園には、昭和47年(1972)から53年(1978)にかけて、県内各地から移築された4棟の伝統的な民家が並び、当時の暮らしをしのぶことができます。",
            },
          },
          {
            id: gokoku.id,
            data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 28)), transitDurationMin: 5 },
          },
          { id: bunka.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 4)) } },
          { id: bijutsukan.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 26)) } },
          { id: heiwadai.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 21)) } },
          {
            id: tachibana.id,
            data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 36)), stayDurationMin: 55 },
          },
        ],
        { tx }
      );

      const created = await tx.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "宮崎県総合博物館" } });
      const credit = creditCache.get("宮崎県総合博物館");
      if (photoUrl) {
        await tx.photo.create({
          data: {
            spotId: created.id,
            url: photoUrl,
            sourceUrl: credit?.sourceUrl ?? null,
            author: credit?.author ?? null,
            license: credit?.license ?? null,
            licenseUrl: credit?.licenseUrl ?? null,
          },
        });
      }
    }, { timeout: 60000 });
  }

  const aoshima = await findSpotInItinerary(ITIN_ID, { spotName: "青島神社" });
  const aoshimaRow = await prisma.spot.findUniqueOrThrow({ where: { id: aoshima.id } });
  if (aoshimaRow.stayDurationMin === 45) {
    await updateSpotInItinerary(ITIN_ID, { spotId: aoshima.id }, { stayDurationMin: 75 });
  }

  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
