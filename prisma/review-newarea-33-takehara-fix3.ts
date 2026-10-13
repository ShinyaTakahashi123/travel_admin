/**
 * #33の直し(企画運営の指摘、2026-10-13)。
 * 1. 竹原町並み保存地区・昼食の座標が丸め値(34.345000,132.911500)で同じ点
 *    だったため、それぞれ別の国土地理院の番地点に修正
 * 2. 竹原町並み保存地区104分(見どころを別スポットに分けた後の純粋な町歩きとして
 *    長すぎる)を55分に短縮し、中を見学できる旧光本家住宅(今井政之陶芸の館。
 *    公式サイトtakeharakankou.jpで由緒・開館時間[10:00-16:00、火水木休]を確認。
 *    時刻は本文に書かない)を追加
 * 3. 竹鶴酒造(外観)の「ニッカウヰスキー創業者」という会社名を外し、ぼかした言い方に
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "bc328b0f-c7d5-4e1f-a2e2-f081eeda5cb8";
const MACHINAMI_SPOT_ID = "5fb3b93f-af24-489e-a7f4-c89c37d15290";
const SHORENJI_SPOT_NAME = "照蓮寺";
const TAKETSURU_SPOT_ID = "a52794b7-d65f-462c-9b9c-b1bfb3a0af54";

const MACHINAMI_NEW_LAT = 34.349373;
const MACHINAMI_NEW_LNG = 132.913696;
const LUNCH_NEW_LAT = 34.344788;
const LUNCH_NEW_LNG = 132.912064;

const MITSUMOTOKE_MEMO =
  "江戸時代に建てられた「復古館」の離れ座敷で、のちに光本家の住まいとなり、竹原市に寄贈されました。土蔵を改装した「今井政之陶芸の館」では、竹原出身の陶芸家・今井政之の作品を展示しています。瀬戸内海の魚や草花をモチーフにした作品など、約30点を見ることができます。";

const TAKETSURU_OLD = "「日本のウイスキーの父」と呼ばれる、ニッカウヰスキー創業者・竹鶴政孝の生家です。";
const TAKETSURU_NEW = "「日本のウイスキーの父」と呼ばれる、日本で初めて本格的なウイスキーづくりに携わったとされる竹鶴政孝の生家です。";

async function main() {
  const machinami = await prisma.spot.findUnique({ where: { id: MACHINAMI_SPOT_ID } });
  const lunch = await prisma.spot.findFirst({ where: { name: "竹原町並み保存地区（昼食）", dayId: DAY_ID } });
  const shorenji = await prisma.spot.findFirst({ where: { name: SHORENJI_SPOT_NAME, dayId: DAY_ID } });
  const taketsuru = await prisma.spot.findUnique({ where: { id: TAKETSURU_SPOT_ID } });
  if (!machinami || machinami.stayDurationMin !== 104 || !lunch || !shorenji || !taketsuru?.memo) throw new Error("想定と違います");
  if (!taketsuru.memo.includes(TAKETSURU_OLD)) throw new Error("竹鶴酒造の置換対象が見つかりません");

  const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: "光本家" } } });
  if (dup) throw new Error("台帳が既に存在します(想定外): 光本家");

  const newTaketsuruMemo = taketsuru.memo.replace(TAKETSURU_OLD, TAKETSURU_NEW);

  console.log("[確認OK] 竹原町並み保存地区・昼食の座標を丸め値から別々の番地点に修正");
  console.log("[確認OK] 竹原町並み保存地区を104分→55分に短縮し、旧光本家住宅を追加");
  console.log("[確認OK] 竹鶴酒造から会社名を外しぼかす");
  console.log("新竹鶴酒造メモ:", newTaketsuruMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: machinami.placeMasterId! } }))!.prefectureAreaId;

  const lunchLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: lunch.id } });
  const shorenjiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: shorenji.id } });
  if (!lunchLeg || !shorenjiLeg) throw new Error("移動データが見つかりません");

  // 座標の修正(台帳・スポットとも)
  await prisma.placeMaster.update({ where: { id: machinami.placeMasterId! }, data: { lat: MACHINAMI_NEW_LAT, lng: MACHINAMI_NEW_LNG, positionSource: "gsi" } });
  await prisma.spot.update({ where: { id: MACHINAMI_SPOT_ID }, data: { lat: MACHINAMI_NEW_LAT, lng: MACHINAMI_NEW_LNG, stayDurationMin: 55 } });
  await prisma.placeMaster.update({ where: { id: lunch.placeMasterId! }, data: { lat: LUNCH_NEW_LAT, lng: LUNCH_NEW_LNG, positionSource: "gsi" } });
  await prisma.spot.update({ where: { id: lunch.id }, data: { lat: LUNCH_NEW_LAT, lng: LUNCH_NEW_LNG } });

  // 照蓮寺以降をいったん退避(orderNoの衝突を避ける)
  const laterSpots = await prisma.spot.findMany({ where: { dayId: DAY_ID, orderNo: { gte: shorenji.orderNo } }, orderBy: { orderNo: "asc" } });
  for (const s of laterSpots) {
    await prisma.spot.update({ where: { id: s.id }, data: { orderNo: s.orderNo + 90 } });
  }

  // 竹原町並み保存地区（昼食）: orderNo3(変更なし)、町並み(10:08+55=11:03)から7分で11:10着
  await prisma.spotTransitLeg.update({ where: { id: lunchLeg.id }, data: { transitDurationMin: 7 } });
  await prisma.spot.update({ where: { id: lunch.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 10)) } });

  // 旧光本家住宅: orderNo4、昼食(11:10+55=12:05)から5分で12:10着、40分滞在
  const mitsumotokePlace = await prisma.placeMaster.create({
    data: {
      name: "旧光本家住宅", address: "広島県竹原市本町3-7-4", lat: 34.346886, lng: 132.909348,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const mitsumotokeSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: mitsumotokePlace.id, orderNo: 4, name: "旧光本家住宅",
      address: "広島県竹原市本町3-7-4", lat: 34.346886, lng: 132.909348,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 10)), memo: MITSUMOTOKE_MEMO, stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: mitsumotokeSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });

  // 照蓮寺: orderNo5、光本家(12:10+40=12:50)から3分で12:53着、30分滞在(変更なし)
  await prisma.spot.update({ where: { id: shorenji.id }, data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 53)) } });
  await prisma.spotTransitLeg.update({ where: { id: shorenjiLeg.id }, data: { transitDurationMin: 3 } });

  // 残りのスポットを順に時刻だけずらして再配置(各滞在・既存の移動時間は変更なし)
  let cursor = new Date(Date.UTC(1970, 0, 1, 12, 53) + 30 * 60000); // 照蓮寺終了=13:23
  let orderNo = 6;
  for (const s of laterSpots.slice(1)) {
    const leg = await prisma.spotTransitLeg.findFirst({ where: { spotId: s.id } });
    if (!leg?.transitDurationMin) throw new Error("移動データが見つかりません: " + s.name);
    cursor = new Date(cursor.getTime() + leg.transitDurationMin * 60000);
    await prisma.spot.update({ where: { id: s.id }, data: { orderNo, visitTime: cursor } });
    cursor = new Date(cursor.getTime() + s.stayDurationMin! * 60000);
    orderNo++;
  }

  // 竹鶴酒造(外観)のメモを修正
  await prisma.spot.update({ where: { id: TAKETSURU_SPOT_ID }, data: { memo: newTaketsuruMemo } });

  console.log("  COMMITTED: #33 旧光本家住宅を追加、座標・竹鶴酒造の表記を修正");
}
main().finally(() => prisma.$disconnect());
