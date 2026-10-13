/**
 * #31の直し(企画運営の指摘、2026-10-13)。
 * 1. 肥前浜宿（昼食）の座標が酒蔵通りと同じ点だったため、国土地理院の番地検索
 *    (佐賀県鹿島市浜町乙2700番地)の点(33.092133, 130.115204)に修正
 * 2. 祐徳稲荷神社の「商売繁盛や交通安全を願う参拝者が絶えません」は効き目をうたう
 *    形に近いため削除
 * 3. 浜庄津町浜金屋町の町並み・祐徳稲荷神社のメモの終わりに、バスの乗り方の一文を追加
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const LUNCH_SPOT_ID_NAME = "肥前浜宿（昼食）";
const HAMAKANAYA_SPOT_ID = "763397e8-936b-4a90-bee6-008d8dd9e68a";

const NEW_LUNCH_LAT = 33.092133;
const NEW_LUNCH_LNG = 130.115204;

const YUTOKU_REMOVE = "日本三大稲荷の一つとされ、商売繁盛や交通安全を願う参拝者が絶えません。";
const YUTOKU_KEEP_HEDGE = "日本三大稲荷の一つとされています。";

const HAMAKANAYA_BUS_NOTE = "ここからは、バスで祐徳稲荷神社へ向かいます(約25分)。";
const YUTOKU_BUS_NOTE = "参拝のあとは、バスで肥前浜駅へ戻ります(約25分)。";

async function main() {
  const lunchSpot = await prisma.spot.findFirst({ where: { name: LUNCH_SPOT_ID_NAME } });
  const hamakanaya = await prisma.spot.findUnique({ where: { id: HAMAKANAYA_SPOT_ID } });
  const yutoku = await prisma.spot.findFirst({ where: { name: "祐徳稲荷神社", dayId: hamakanaya?.dayId } });
  if (!lunchSpot || !hamakanaya?.memo || !yutoku?.memo) throw new Error("想定と違います");
  if (!yutoku.memo.includes(YUTOKU_REMOVE)) throw new Error("祐徳稲荷神社の置換対象が見つかりません");
  if (hamakanaya.memo.includes(HAMAKANAYA_BUS_NOTE)) throw new Error("浜金屋町に既にバスの一文があります(想定外)");

  const newYutokuMemo = yutoku.memo.replace(YUTOKU_REMOVE, YUTOKU_KEEP_HEDGE) + YUTOKU_BUS_NOTE;
  const newHamakanayaMemo = hamakanaya.memo + HAMAKANAYA_BUS_NOTE;

  console.log("[確認OK] 肥前浜宿（昼食）の座標を直す:", lunchSpot.lat, lunchSpot.lng, "→", NEW_LUNCH_LAT, NEW_LUNCH_LNG);
  console.log("[確認OK] 祐徳稲荷神社の効き目をうたう一文を削除");
  console.log("[確認OK] 浜金屋町・祐徳稲荷神社にバスの乗り方の一文を追加");
  console.log("新浜金屋町メモ:", newHamakanayaMemo);
  console.log("新祐徳稲荷神社メモ:", newYutokuMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const lunchPlace = await prisma.placeMaster.findUnique({ where: { id: lunchSpot.placeMasterId! } });
  if (lunchPlace) {
    await prisma.placeMaster.update({ where: { id: lunchPlace.id }, data: { lat: NEW_LUNCH_LAT, lng: NEW_LUNCH_LNG, positionSource: "gsi" } });
  }
  await prisma.spot.update({ where: { id: lunchSpot.id }, data: { lat: NEW_LUNCH_LAT, lng: NEW_LUNCH_LNG } });
  await prisma.spot.update({ where: { id: hamakanaya.id }, data: { memo: newHamakanayaMemo } });
  await prisma.spot.update({ where: { id: yutoku.id }, data: { memo: newYutokuMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
