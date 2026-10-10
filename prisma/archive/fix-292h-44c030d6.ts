/**
 * チェックリスト #292 の修正記録(見直しの続き7、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * fix-292gの取りこぼしを自分で発見して修正:
 *
 * Day1: 蔵王地蔵尊を挿入した際、高湯通り以降の時刻をずらし忘れていた
 * (「時刻の計算が合わない」)。高湯通り13:14、酢川温泉神社14:57、下湯共同浴場
 * 15:22に修正(結果はDay1全体で16:37終了、蔵王地蔵尊を足す前の本来の終了時刻
 * と一致)。
 *
 * Day2: 鳥兜山展望台の座標を実際の「鳥兜駅」の点に直した結果、蔵王中央
 * ロープウェイとの直線距離が1.9kmあることが判明。これはロープウェイでの
 * 移動(徒歩ではない)にあたるため、御幸ヶ原(筑波山)と同じ考え方でtransit:nullに
 * 修正(ロープウェイでの到着は蔵王中央ロープウェイ自身の本文で説明済み)。
 * 鳥兜山展望台→どっこ沼は、実際の距離0.5kmにあわせて移動時間を25分→15分に
 * 短縮。あわせて、蔵王中央高原駅の滞在を40分→50分に調整し、Day2の終了が
 * 16:30〜17:00の窓に収まるようにした(既存スポットの滞在は延ばしていない)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292h-44c030d6.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  // Day1
  const takayu = await findSpotInItinerary(ITIN_ID, { spotName: "高湯通り" });
  const takayuRow = await prisma.spot.findUniqueOrThrow({ where: { id: takayu.id } });
  if (takayuRow.visitTime?.getUTCHours() === 12 && takayuRow.visitTime?.getUTCMinutes() === 49) {
    await updateSpotInItinerary(ITIN_ID, { spotId: takayu.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 14)),
    });
  }
  const suzukawa = await findSpotInItinerary(ITIN_ID, { spotName: "酢川温泉神社" });
  const suzukawaRow = await prisma.spot.findUniqueOrThrow({ where: { id: suzukawa.id } });
  if (suzukawaRow.visitTime?.getUTCHours() === 14 && suzukawaRow.visitTime?.getUTCMinutes() === 59) {
    await updateSpotInItinerary(ITIN_ID, { spotId: suzukawa.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 57)),
    });
  }
  const shimoyu = await findSpotInItinerary(ITIN_ID, { spotName: "下湯共同浴場" });
  const shimoyuRow = await prisma.spot.findUniqueOrThrow({ where: { id: shimoyu.id } });
  if (shimoyuRow.visitTime?.getUTCHours() === 15 && shimoyuRow.visitTime?.getUTCMinutes() === 24) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shimoyu.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 22)),
    });
  }

  // Day2
  const tenbodai = await findSpotInItinerary(ITIN_ID, { spotName: "鳥兜山展望台" });
  const tenbodaiRow = await prisma.spot.findUniqueOrThrow({ where: { id: tenbodai.id } });
  if (tenbodaiRow.transitDurationMin === 2) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tenbodai.id }, {
      transitMode: null,
      transitDurationMin: null,
      memo: tenbodaiRow.memo!.replace(
        "蔵王中央ロープウェイの鳥兜駅からすぐです。",
        "蔵王中央ロープウェイで鳥兜駅まで登ります。"
      ),
    });
  }

  const dokko = await findSpotInItinerary(ITIN_ID, { spotName: "どっこ沼" });
  const dokkoRow = await prisma.spot.findUniqueOrThrow({ where: { id: dokko.id } });
  if (dokkoRow.transitDurationMin === 25) {
    await updateSpotInItinerary(ITIN_ID, { spotId: dokko.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 7)),
      transitDurationMin: 15,
    });
  }

  const katakai = await findSpotInItinerary(ITIN_ID, { spotName: "片貝沼" });
  const katakaiRow = await prisma.spot.findUniqueOrThrow({ where: { id: katakai.id } });
  if (katakaiRow.visitTime?.getUTCHours() === 13 && katakaiRow.visitTime?.getUTCMinutes() === 54) {
    await updateSpotInItinerary(ITIN_ID, { spotId: katakai.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 42)),
    });
  }

  const chuoKogen = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王中央高原駅" });
  const chuoKogenRow = await prisma.spot.findUniqueOrThrow({ where: { id: chuoKogen.id } });
  if (chuoKogenRow.stayDurationMin === 40) {
    await updateSpotInItinerary(ITIN_ID, { spotId: chuoKogen.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 47)),
      stayDurationMin: 50,
    });
  }

  const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
  const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
  if (kyodoRow.visitTime?.getUTCHours() === 15 && kyodoRow.visitTime?.getUTCMinutes() === 49) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 47)),
    });
  }

  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });
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
