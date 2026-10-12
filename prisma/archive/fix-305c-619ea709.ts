/**
 * チェックリスト #305 の修正記録(企画運営3点)。
 * しおり「仙巌園と尚古集成館、世界遺産・薩摩の近代化遺産を巡るプラン」
 * (619ea709-6437-438a-8421-ce3ad8852486)
 *
 * 企画運営の指摘:
 * 1. 異人館(11:44〜12:14)の昼食の一言のあと、城山展望台に12:26着では
 *    昼食の時間がない。異人館の滞在を30→50分にし、見学のあとに実際に
 *    昼食をとる時間を確保(ほかのスポットの滞在は延ばさず、後続の
 *    visitTimeを+20分でカスケード)。
 * 2. 最初のスポット(仙巌園)に、移動手段(車でめぐる)の案内を追加。
 * 3. 異人館の「日本初の洋式紡績工場・鹿児島紡績所」→
 *    「日本初の洋式紡績工場とされる鹿児島紡績所」にヘッジ。
 *
 * 法務の指摘: しおりのdescriptionの「日本初の西洋式工場群」も同様に
 * ヘッジ(異人館と合わせて言い切りが2か所あった)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-305c-619ea709.ts
 * (実行済み。異人館の滞在時間で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "619ea709-6437-438a-8421-ce3ad8852486";

async function main() {
  const senganen = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "仙巌園" } });
  const carIntro = "この旅は車でめぐります。";
  if (senganen.memo && !senganen.memo.startsWith(carIntro)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: senganen.id }, { memo: carIntro + senganen.memo });
  }

  const ijinkan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "旧鹿児島紡績所技師館(異人館)" },
  });
  if (ijinkan.stayDurationMin === 30) {
    const fixedMemo = (ijinkan.memo ?? "").replace(
      "日本初の洋式紡績工場・鹿児島紡績所の技術指導にあたった",
      "日本初の洋式紡績工場とされる鹿児島紡績所の技術指導にあたった"
    );
    await updateSpotInItinerary(ITIN_ID, { spotId: ijinkan.id }, { stayDurationMin: 50, memo: fixedMemo });
  }

  // 後続スポットのvisitTimeを+20分でカスケード
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "旧鹿児島紡績所技師館(異人館)") {
      cursor = new Date(s.visitTime!.getTime() + s.stayDurationMin! * 60000);
      continue;
    }
    if (cursor == null) continue;
    const base: Date = cursor;
    const start: Date = new Date(base.getTime() + (s.transitDurationMin ?? 0) * 60000);
    if (s.visitTime?.getTime() !== start.getTime()) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: start });
    }
    cursor = new Date(start.getTime() + (s.stayDurationMin ?? 0) * 60000);
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description?.includes("日本初の西洋式工場群")) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: { description: itin.description.replace("日本初の西洋式工場群", "日本初とされる西洋式工場群") },
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
