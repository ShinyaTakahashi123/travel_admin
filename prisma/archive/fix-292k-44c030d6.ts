/**
 * チェックリスト #292 の修正記録(見直し4、企画運営4点・法務1点)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 1. 事実確認(企画運営・法務の指摘): 蔵王地蔵尊の由来が事実と違うおそれがあった。
 *    運営会社公式 https://zaoropeway.co.jp/summer/zaojizo.php を直接開いて確認:
 *    安永4年(1775、乙未年)に造立、完成までおよそ37年、高さ2.34m、地蔵山頂駅から
 *    100mの距離、「災難よけ地蔵」と呼ばれる由来。誤りだった「大正時代に山頂に
 *    移された」「雪の重みで倒れそうになった際には…立て直された」の2文を削除し、
 *    確認できた事実に全面的に書き直した。
 *
 * 2. 決まり5: 駅は過ごす場所ではないため、蔵王中央高原駅の滞在を55分→20分に
 *    短縮(駅前の蔵王大権現と眺めのみ)。
 *
 * 3. 移動手段: ロープウェイ・リフトの区間をcarやtransit:nullで表したのは誤り
 *    (乗った乗り物と違う手段になる)。すべてotherに統一し、本文に「ロープウェイで」
 *    と明記する形に修正(蔵王中央ロープウェイ→鳥兜山展望台、蔵王地蔵尊→高湯通り)。
 *
 * 4. 蔵王ロープウェイ(90分)と蔵王地蔵尊(25分)の滞在が重なっていた(地蔵尊は
 *    山頂駅から100mの場所)。ロープウェイを往復の乗車のみ(45分)にし、山頂での
 *    時間を地蔵尊(70分)に移した。90+25=115分だった合計を45+70=115分のまま
 *    維持し、Day1の終了時刻(16:37)は変えていない。
 *
 * Day2は、駅の滞在短縮(2)にともない終了が16:05となり、決まり2(16:30〜17:00)
 * にわずかに届かなくなった。この区間(蔵王中央高原・どっこ沼・片貝沼周辺)で
 * OSMに座標のある別の実在の行き先を探したが(うつぼ沼・目玉沼、不動滝[宮城県
 * 蔵王町で別地域]、トニーザイラー顕彰碑、蔵王大権現[山形市下宝沢、7.5km離れて
 * おり別の場所]を確認したが、いずれも使えなかった)、見つけられなかったため、
 * 企画運営に報告のうえ判断を仰ぐ。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292k-44c030d6.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  // === Day1 ===
  const ropeway = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王ロープウェイ" });
  const ropewayRow = await prisma.spot.findUniqueOrThrow({ where: { id: ropeway.id } });
  if (ropewayRow.stayDurationMin === 90) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ropeway.id }, { stayDurationMin: 45 });
  }

  const jizo = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王地蔵尊" });
  await updateSpotInItinerary(ITIN_ID, { spotId: jizo.id }, {
    stayDurationMin: 70,
    memo:
      "蔵王地蔵尊は、地蔵山頂駅から100mほどの場所に立つ、高さ2.34mの大きな石の地蔵尊です。安永4年(1775)に造立され、完成までにはおよそ37年の歳月がかけられたと伝えられています。建立後、遭難者が少なくなったことから、「災難よけ地蔵」と呼ばれるようになりました。周囲には360度の大パノラマが広がっています。静かに手を合わせましょう。",
  });

  const takayu = await findSpotInItinerary(ITIN_ID, { spotName: "高湯通り" });
  const takayuRow = await prisma.spot.findUniqueOrThrow({ where: { id: takayu.id } });
  if (takayuRow.transitMode === "car") {
    await updateSpotInItinerary(ITIN_ID, { spotId: takayu.id }, {
      transitMode: "walk",
      transitDurationMin: 11,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 14)),
      memo: takayuRow.memo!.replace(
        "蔵王ロープウェイで山麓へ戻り、車で15分ほどです。",
        "蔵王ロープウェイで山麓へ戻り、歩いて11分ほどです。"
      ),
    });
  }
  const suzukawa = await findSpotInItinerary(ITIN_ID, { spotName: "酢川温泉神社" });
  const suzukawaRow = await prisma.spot.findUniqueOrThrow({ where: { id: suzukawa.id } });
  if (suzukawaRow.visitTime?.getUTCHours() === 15 && suzukawaRow.visitTime?.getUTCMinutes() === 1) {
    await updateSpotInItinerary(ITIN_ID, { spotId: suzukawa.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 57)),
    });
  }
  const shimoyu = await findSpotInItinerary(ITIN_ID, { spotName: "下湯共同浴場" });
  const shimoyuRow = await prisma.spot.findUniqueOrThrow({ where: { id: shimoyu.id } });
  if (shimoyuRow.visitTime?.getUTCHours() === 15 && shimoyuRow.visitTime?.getUTCMinutes() === 26) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shimoyu.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 22)),
    });
  }

  // === Day2 ===
  const tenbodai = await findSpotInItinerary(ITIN_ID, { spotName: "鳥兜山展望台" });
  const tenbodaiRow = await prisma.spot.findUniqueOrThrow({ where: { id: tenbodai.id } });
  if (tenbodaiRow.transitMode === null) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tenbodai.id }, {
      transitMode: "other",
      transitDurationMin: 8,
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 20)),
    });
  }
  const dokko = await findSpotInItinerary(ITIN_ID, { spotName: "どっこ沼" });
  const dokkoRow = await prisma.spot.findUniqueOrThrow({ where: { id: dokko.id } });
  if (dokkoRow.visitTime?.getUTCHours() === 12 && dokkoRow.visitTime?.getUTCMinutes() === 4) {
    await updateSpotInItinerary(ITIN_ID, { spotId: dokko.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 10)),
    });
  }
  const katakai = await findSpotInItinerary(ITIN_ID, { spotName: "片貝沼" });
  const katakaiRow = await prisma.spot.findUniqueOrThrow({ where: { id: katakai.id } });
  if (katakaiRow.visitTime?.getUTCHours() === 13 && katakaiRow.visitTime?.getUTCMinutes() === 39) {
    await updateSpotInItinerary(ITIN_ID, { spotId: katakai.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 45)),
    });
  }
  const chuoKogen = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王中央高原駅" });
  const chuoKogenRow = await prisma.spot.findUniqueOrThrow({ where: { id: chuoKogen.id } });
  if (chuoKogenRow.stayDurationMin === 55) {
    await updateSpotInItinerary(ITIN_ID, { spotId: chuoKogen.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 50)),
      stayDurationMin: 20,
    });
  }
  const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
  const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
  if (kyodoRow.visitTime?.getUTCHours() === 15 && kyodoRow.visitTime?.getUTCMinutes() === 49) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 20)),
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
