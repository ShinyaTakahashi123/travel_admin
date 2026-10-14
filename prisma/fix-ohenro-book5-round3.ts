/**
 * お遍路 本5(#13)の3回目の直し(企画運営指摘、2026-10-14)。
 *
 * 道の駅みしょうMICを70分→40分に戻す(観自在寺の水増しを移しただけだった
 * ため)。空いた30分は、実在の道の駅「津島やすらぎの里」(OSM node
 * 6479541833 amenity=public_bath、レストラン設備を全国道の駅公式サイトで
 * 確認済み)を、みしょうMICと宇和島城の間に追加して埋める。
 *
 * 【今回からの決まり(企画運営2026-10-14)】対象はすべてidで指定し、
 * 更新前にday→itineraryのidが本5(f22cbf27)と一致するか確認してから
 * 書き込む。確認モードでは、書き換える対象のid・しおりの題・前後の値を
 * すべて出す。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book5-round3.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book5-round3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const BOOK13_ID = "f22cbf27-466d-455e-90c5-3b4c6b9f1323";
const MISHO_MIC_ID = "f5a27cba-96fe-4cbd-b1ec-0b8ccc007e9c";
const UWAJIMAJO_ID = "cb202026-5fad-4a75-8d0f-f526d7da04b3";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function assertBelongsTo(spotId: string, itineraryId: string) {
  const spot = await prisma.spot.findUnique({ where: { id: spotId }, include: { day: { include: { itinerary: { select: { id: true, title: true } } } } } });
  if (!spot) throw new Error(`spot not found: ${spotId}`);
  if (spot.day.itinerary.id !== itineraryId) {
    throw new Error(`対象外のしおりです: spot=${spotId} name=${spot.name} itinerary=${spot.day.itinerary.id}(${spot.day.itinerary.title})`);
  }
  return spot;
}

async function main() {
  const mishoMic = await assertBelongsTo(MISHO_MIC_ID, BOOK13_ID);
  const uwajimajo = await assertBelongsTo(UWAJIMAJO_ID, BOOK13_ID);

  // 日1の、宇和島城以降すべて(id・現在のorderNoを確認してから対象にする)
  const day1Spots = await prisma.spot.findMany({ where: { dayId: mishoMic.dayId }, orderBy: { orderNo: "asc" } });
  for (const s of day1Spots) {
    const belongs = await assertBelongsTo(s.id, BOOK13_ID);
    if (belongs.id !== s.id) throw new Error("unreachable");
  }
  const toShift = day1Spots.filter((s) => s.orderNo >= uwajimajo.orderNo);

  console.log("[対象確認] しおり:", BOOK13_ID, "(本5)");
  console.log(`  ${mishoMic.name}(${mishoMic.id}): visitTime=${mishoMic.visitTime} stay=${mishoMic.stayDurationMin} → visitTime=10:05 stay=40`);
  console.log("  新規: 津島やすらぎの里(みしょうMICと宇和島城の間、11:07-11:47)");
  for (const s of toShift) {
    console.log(`  ${s.name}(${s.id}): orderNo ${s.orderNo} → ${s.orderNo + 1}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: MISHO_MIC_ID }, data: { visitTime: t(10, 5), stayDurationMin: 40 } });

  // 退避
  for (const s of toShift) {
    await prisma.spot.update({ where: { id: s.id }, data: { orderNo: s.orderNo + 90 } });
  }

  const place = await prisma.placeMaster.create({
    data: { name: "津島やすらぎの里", address: "愛媛県宇和島市津島町高田830-1", lat: 33.139696, lng: 132.520381, category: "onsen", source: "ai_collected", positionSource: "osm" },
  });
  const spot = await prisma.spot.create({
    data: {
      dayId: mishoMic.dayId, placeMasterId: place.id, orderNo: uwajimajo.orderNo, name: "津島やすらぎの里",
      address: place.address, lat: place.lat, lng: place.lng,
      memo: "宇和島市津島町にある、日帰り温泉と食事処のある施設です。",
      visitTime: t(11, 7), stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: spot.id, orderNo: 1, transitMode: "car", transitDurationMin: 22 } });

  // 退避した分を本来の位置(+1)へ
  for (const s of toShift) {
    await prisma.spot.update({ where: { id: s.id }, data: { orderNo: s.orderNo + 1 } });
  }
  await prisma.spotTransitLeg.updateMany({ where: { spotId: UWAJIMAJO_ID }, data: { transitDurationMin: 11 } });
  await prisma.spot.update({ where: { id: UWAJIMAJO_ID }, data: { visitTime: t(11, 58) } });

  // 宇和島城以降、下流の時刻を組み直す(座標・滞在時間は変更なし)
  const kisaiya = toShift.find((s) => s.name === "うわじまきさいや広場（昼食）");
  const date = toShift.find((s) => s.name === "宇和島市立伊達博物館");
  const tenshaen = toShift.find((s) => s.name === "天赦園");
  const rekishi = toShift.find((s) => s.name === "宇和島市立歴史資料館");
  if (!kisaiya || !date || !tenshaen || !rekishi) throw new Error("想定と違います(下流スポット)");
  await prisma.spot.update({ where: { id: kisaiya.id }, data: { visitTime: t(13, 6) } });
  await prisma.spot.update({ where: { id: date.id }, data: { visitTime: t(14, 9) } });
  await prisma.spot.update({ where: { id: tenshaen.id }, data: { visitTime: t(15, 6) } });
  await prisma.spot.update({ where: { id: rekishi.id }, data: { visitTime: t(16, 0) } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
