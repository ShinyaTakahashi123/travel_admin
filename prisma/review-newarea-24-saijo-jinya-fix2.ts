/**
 * #24の直し直し(自己点検)。1本目のスクリプトでorderNoの衝突(日ごとのorderNoの
 * 一意制約)を先に避けずにスポットを作ろうとして失敗した。説明文・陣屋跡のメモの
 * 修正は既に反映済みのため、残りの作業(駅前の昼食スポットの追加・orderNoの
 * ずらし・時刻の調整)だけをやり直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "a2264601-1ab1-4914-b7d8-5835983c2413";
const JINYA_SPOT_ID = "c47d1572-32ce-47eb-a4d7-886a0c7eff1c";
const TETSUDO_SPOT_ID = "e9d7359f-c94f-4c93-9952-e7653214e756";
const KORYU_SPOT_ID = "1cee668d-3d10-4cfd-9f0b-27c84ed1c7b7";

const EKIMAE_MEMO = "JR伊予西条駅前には、飲食店が点在しています。好みの店で昼食をとりましょう。";

async function main() {
  const jinya = await prisma.spot.findUnique({ where: { id: JINYA_SPOT_ID } });
  const tetsudo = await prisma.spot.findUnique({ where: { id: TETSUDO_SPOT_ID } });
  const koryu = await prisma.spot.findUnique({ where: { id: KORYU_SPOT_ID } });
  if (!jinya || !tetsudo || !koryu) throw new Error("想定と違います");
  if (tetsudo.orderNo !== 4 || koryu.orderNo !== 5) throw new Error("orderNoが想定と違います(既に直し済みの可能性)");

  const tetsudoTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: tetsudo.id, orderNo: 1 } });
  const koryuTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: koryu.id, orderNo: 1 } });
  if (!tetsudoTransit || !koryuTransit) throw new Error("移動データが見つかりません");

  const ekimaeDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "伊予西条駅前" } } });
  if (ekimaeDup) throw new Error("台帳が既に存在します(想定外)");

  console.log("[確認OK] 伊予西条駅前（昼食）を追加し、orderNoをずらして時刻を調整する");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: jinya.placeMasterId! } }))!.prefectureAreaId;

  // 1. 既存の4・5番をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: KORYU_SPOT_ID }, data: { orderNo: 99 } });
  await prisma.spot.update({ where: { id: TETSUDO_SPOT_ID }, data: { orderNo: 98 } });

  // 2. 伊予西条駅前（昼食）: orderNo 4、陣屋跡(11:25+75=12:40)から20分で13:00着、60分滞在
  const ekimaePlace = await prisma.placeMaster.create({
    data: {
      name: "伊予西条駅前", address: "愛媛県西条市大町", lat: 33.911625, lng: 133.189255,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "address", verifiedAt: new Date(),
    },
  });
  const ekimaeSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: ekimaePlace.id, orderNo: 4, name: "伊予西条駅前（昼食）",
      address: "愛媛県西条市大町", lat: 33.911625, lng: 133.189255,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 0)), memo: EKIMAE_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: ekimaeSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 20 } });

  // 3. 四国鉄道文化館: orderNo 5、伊予西条駅前(13:00+60=14:00)から5分で14:05着、90分滞在(60→90に延長)
  await prisma.spot.update({ where: { id: TETSUDO_SPOT_ID }, data: { orderNo: 5 } });
  await prisma.spotTransitLeg.update({ where: { id: tetsudoTransit.id }, data: { transitDurationMin: 5 } });
  await prisma.spot.update({
    where: { id: TETSUDO_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 5)), stayDurationMin: 90 },
  });

  // 4. 西条市観光交流センター: orderNo 6、鉄道文化館(14:05+90=15:35)から5分で15:40着、50分滞在(16:30終了)
  await prisma.spot.update({ where: { id: KORYU_SPOT_ID }, data: { orderNo: 6 } });
  await prisma.spotTransitLeg.update({ where: { id: koryuTransit.id }, data: { transitDurationMin: 5 } });
  await prisma.spot.update({
    where: { id: KORYU_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)), stayDurationMin: 50 },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
