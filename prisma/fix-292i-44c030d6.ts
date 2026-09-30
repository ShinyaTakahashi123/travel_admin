/**
 * チェックリスト #292 の修正記録(見直しの続き8、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * fix-292hの取りこぼしを自分で発見して修正:
 *
 * Day1: 蔵王地蔵尊→高湯通りの移動を徒歩11分としていたが、実際は蔵王ロープウェイ
 * で山頂から山麓へ戻る道のりのため、直線距離(3.5km)を徒歩の速さとして計算すると
 * 「速すぎ」になっていた。手段をcar(ロープウェイ+道路)に変更し、15分に修正。
 * 本文の書き出しも、ロープウェイで山麓へ戻る旨に修正。
 *
 * Day2: どっこ沼の開始時刻の計算を誤っていた(鳥兜山展望台の終了11:54+移動15分=
 * 12:09のはずが12:07にしてしまっていた)。あわせて、実際の距離0.5kmに対して
 * 15分はやや長めだったため10分に短縮(「近いのにother」の指摘の解消)。
 * 空いた時間は、蔵王中央高原駅の滞在を50分→55分に調整して補い、Day2の終了が
 * 16:30〜17:00の窓に収まるようにした。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292i-44c030d6.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const takayu = await findSpotInItinerary(ITIN_ID, { spotName: "高湯通り" });
  const takayuRow = await prisma.spot.findUniqueOrThrow({ where: { id: takayu.id } });
  if (takayuRow.transitMode === "walk" && takayuRow.transitDurationMin === 11) {
    await updateSpotInItinerary(ITIN_ID, { spotId: takayu.id }, {
      transitMode: "car",
      transitDurationMin: 15,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 18)),
      memo: takayuRow.memo!.replace(
        "蔵王ロープウェイからは歩いて11分ほどです。",
        "蔵王ロープウェイで山麓へ戻り、車で15分ほどです。"
      ),
    });
  }

  const suzukawa = await findSpotInItinerary(ITIN_ID, { spotName: "酢川温泉神社" });
  const suzukawaRow = await prisma.spot.findUniqueOrThrow({ where: { id: suzukawa.id } });
  if (suzukawaRow.visitTime?.getUTCHours() === 14 && suzukawaRow.visitTime?.getUTCMinutes() === 57) {
    await updateSpotInItinerary(ITIN_ID, { spotId: suzukawa.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 1)),
    });
  }
  const shimoyu = await findSpotInItinerary(ITIN_ID, { spotName: "下湯共同浴場" });
  const shimoyuRow = await prisma.spot.findUniqueOrThrow({ where: { id: shimoyu.id } });
  if (shimoyuRow.visitTime?.getUTCHours() === 15 && shimoyuRow.visitTime?.getUTCMinutes() === 22) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shimoyu.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 26)),
    });
  }

  const dokko = await findSpotInItinerary(ITIN_ID, { spotName: "どっこ沼" });
  const dokkoRow = await prisma.spot.findUniqueOrThrow({ where: { id: dokko.id } });
  if (dokkoRow.visitTime?.getUTCHours() === 12 && dokkoRow.visitTime?.getUTCMinutes() === 7) {
    await updateSpotInItinerary(ITIN_ID, { spotId: dokko.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 4)),
      transitDurationMin: 10,
    });
  }
  const katakai = await findSpotInItinerary(ITIN_ID, { spotName: "片貝沼" });
  const katakaiRow = await prisma.spot.findUniqueOrThrow({ where: { id: katakai.id } });
  if (katakaiRow.visitTime?.getUTCHours() === 13 && katakaiRow.visitTime?.getUTCMinutes() === 42) {
    await updateSpotInItinerary(ITIN_ID, { spotId: katakai.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 39)),
    });
  }
  const chuoKogen = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王中央高原駅" });
  const chuoKogenRow = await prisma.spot.findUniqueOrThrow({ where: { id: chuoKogen.id } });
  if (chuoKogenRow.stayDurationMin === 50) {
    await updateSpotInItinerary(ITIN_ID, { spotId: chuoKogen.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 44)),
      stayDurationMin: 55,
    });
  }
  const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
  const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
  if (kyodoRow.visitTime?.getUTCHours() === 15 && kyodoRow.visitTime?.getUTCMinutes() === 47) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 49)),
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
