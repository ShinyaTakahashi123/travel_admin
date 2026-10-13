/**
 * #26の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 吉井歴史民俗資料館(開館9:00-16:30)が15:42-16:32で閉館を過ぎていたため、
 *   順番を組み直し、資料館を1番目(朝一)に移動。最後は閉館のない新川田篭の
 *   町並みにする
 * 2. 流川の桜並木(季節タグ summer/autumn と桜の見頃がずれる)を削除し、調音の滝
 *   公園(crossroadfukuoka.jp spot/12720で確認。落差約27m、水源の森百選、夏は
 *   流水プール開放)に差し替える。写真は企画運営の了承どおりなしで進める
 * 3. 吉井歴史民俗資料館「毎月第3土曜日のみ」から曜日・日付を削除
 * 4. 道の駅うきは（昼食）の滞在を90分→60分に短縮
 * 5. 弘農園「Instagramなど」というサービス名を削除
 *
 * 新しい順番(9:30スタート、16:30終了):
 * 1.吉井歴史民俗資料館 2.調音の滝公園 3.道の駅うきは（昼食） 4.弘農園
 * 5.つづら棚田 6.新川田篭の町並み
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "258b3878-0458-417b-be90-76bd7b12ed23";
const DAY_ID = "49402151-658e-46b0-8e52-ece5a1098171";
const NEW_DESCRIPTION =
  "吉井歴史民俗資料館と調音の滝公園から、地元の果物が並ぶ道の駅うきは、ぶどう・なし狩りの弘農園、日本棚田百選のつづら棚田、重要伝統的建造物群保存地区・新川田篭の集落まで、実りの季節のうきはを楽しむ日帰りプランです。";
const TSUZURA_SPOT_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";
const HIRONOEN_SPOT_ID = "cdbfeb40-0555-4632-ba5d-ef5220a7fe3f";
const MICHINOEKI_SPOT_ID = "5bda41e2-6fbd-4ca9-9dcf-48e08ce2e203";
const TAGOMORI_SPOT_NAME = "新川田篭の町並み";
const SHIRYOKAN_SPOT_NAME = "吉井歴史民俗資料館";
const NAGAREKAWA_SPOT_NAME = "流川の桜並木";

const CHOON_MEMO =
  "巨瀬川の支流にかかる、落差約27mの滝がある公園です。水が流れ落ちる音が、まるで天然のメロディーのように響くことから「調音の滝」と名付けられました。周辺は「水源の森百選」にも選ばれた豊かな緑に囲まれています。夏には、滝の音を聞きながら涼める流水プールが開放されることもあります。";

async function main() {
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_SPOT_ID } });
  const hironoen = await prisma.spot.findUnique({ where: { id: HIRONOEN_SPOT_ID } });
  const michinoeki = await prisma.spot.findUnique({ where: { id: MICHINOEKI_SPOT_ID } });
  const tagomori = await prisma.spot.findFirst({ where: { name: TAGOMORI_SPOT_NAME } });
  const shiryokan = await prisma.spot.findFirst({ where: { name: SHIRYOKAN_SPOT_NAME } });
  const nagarekawa = await prisma.spot.findFirst({ where: { name: NAGAREKAWA_SPOT_NAME } });
  if (!tsuzura || !hironoen?.memo || !michinoeki || !tagomori || !shiryokan?.memo || !nagarekawa) {
    throw new Error("想定と違います");
  }

  const newHironoenMemo = hironoen.memo.replace(
    "営業状況は季節により変わるので、園の公式の案内(Instagramなど)で確かめましょう。",
    "営業状況は季節により変わるので、園の公式の案内で確かめましょう。"
  );
  const newShiryokanMemo = shiryokan.memo.replace(
    "内部の公開は毎月第3土曜日のみで、事前の予約が必要です。",
    "内部の公開日は限られており、事前の予約が必要です。"
  );
  if (newHironoenMemo === hironoen.memo || newShiryokanMemo === shiryokan.memo) throw new Error("置換対象が見つかりません");

  const choonDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "調音の滝" } } });
  if (choonDup) throw new Error("台帳が既に存在します(想定外)");

  console.log("[確認OK] 流川の桜並木を削除し、調音の滝公園に差し替える");
  console.log("[確認OK] 順番を組み直す(資料館を1番目、新川田篭を最後に)");
  console.log("[確認OK] 資料館の日付の記述・弘農園のサービス名を削除");
  console.log("[確認OK] 道の駅うきは（昼食）の滞在を90分→60分に短縮");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: tsuzura.placeMasterId! } }))!.prefectureAreaId;

  // 流川の桜並木を削除(写真なし、transitLegもなし)
  const nagarekawaPmId = nagarekawa.placeMasterId!;
  await prisma.spot.delete({ where: { id: nagarekawa.id } });
  await prisma.placeMaster.delete({ where: { id: nagarekawaPmId } });

  // 全スポットをいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: shiryokan.id }, data: { orderNo: 90 } });
  await prisma.spot.update({ where: { id: MICHINOEKI_SPOT_ID }, data: { orderNo: 91 } });
  await prisma.spot.update({ where: { id: HIRONOEN_SPOT_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: TSUZURA_SPOT_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: tagomori.id }, data: { orderNo: 94 } });

  // 1. 吉井歴史民俗資料館: 9:30-10:20(50分、既存のまま)
  await prisma.spot.update({
    where: { id: shiryokan.id },
    data: { orderNo: 1, memo: newShiryokanMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 30)) },
  });

  // 2. 調音の滝公園: 資料館(9:30+50=10:20)から10分で10:30着、45分滞在
  const choonPlace = await prisma.placeMaster.create({
    data: {
      name: "調音の滝公園", address: "福岡県うきは市浮羽町妹川3184", lat: 33.299595, lng: 130.758911,
      prefectureAreaId, category: "nature", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const choonSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: choonPlace.id, orderNo: 2, name: "調音の滝公園",
      address: "福岡県うきは市浮羽町妹川3184", lat: 33.299595, lng: 130.758911,
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)), memo: CHOON_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: choonSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });

  // 3. 道の駅うきは（昼食）: 調音の滝(10:30+45=11:15)から15分で11:30着、60分滞在(90→60)
  await prisma.spot.update({
    where: { id: MICHINOEKI_SPOT_ID },
    data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 30)), stayDurationMin: 60 },
  });
  const michinoekiTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: MICHINOEKI_SPOT_ID, orderNo: 1 } });
  if (michinoekiTransit) await prisma.spotTransitLeg.update({ where: { id: michinoekiTransit.id }, data: { transitDurationMin: 15 } });

  // 4. 弘農園: 道の駅(11:30+60=12:30)から2分で12:32着、80分滞在(既存のまま)
  await prisma.spot.update({
    where: { id: HIRONOEN_SPOT_ID },
    data: { orderNo: 4, memo: newHironoenMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 32)) },
  });
  const hironoenTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: HIRONOEN_SPOT_ID, orderNo: 1 } });
  if (hironoenTransit) await prisma.spotTransitLeg.update({ where: { id: hironoenTransit.id }, data: { transitDurationMin: 2 } });

  // 5. つづら棚田: 弘農園(12:32+80=13:52)から15分で14:07着、70分滞在(60→70に調整)
  await prisma.spot.update({
    where: { id: TSUZURA_SPOT_ID },
    data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 7)), stayDurationMin: 70 },
  });

  // 6. 新川田篭の町並み: つづら棚田(14:07+70=15:17)から10分で15:27着、63分滞在(16:30終了)
  const tagomoriTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: tagomori.id, orderNo: 1 } });
  await prisma.spot.update({
    where: { id: tagomori.id },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 27)), stayDurationMin: 63 },
  });
  if (tagomoriTransit) await prisma.spotTransitLeg.update({ where: { id: tagomoriTransit.id }, data: { transitDurationMin: 10 } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
