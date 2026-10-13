/**
 * #30の直し(企画運営・法務の指摘、2026-10-13)。
 * 1. 鶴ヶ城周辺（昼食）の座標が鶴ヶ城と同じ点だったため、国土地理院の番地検索
 *    (福島県会津若松市追手町6番、城の北側の食事処が集まるあたり)の点に直す
 * 2. 末廣酒造の「併設の『蔵喫茶 杏』」から店名を外す
 * 3. 飯盛山のメモの2・3文目(亡くなるまでの経緯、「見誤った」説)を削除し、
 *    法務の例文に合わせて書き直す。石段の足元の一言も追加
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const LUNCH_SPOT_ID = "b6107088-e4ff-4ea8-a0d9-db92f7a2a40e";
const LUNCH_PLACE_NAME = "鶴ヶ城周辺";
const SUEHIRO_SPOT_ID = "d0f0f53d-cbb2-4fd4-893d-6da3e13c59f4";
const IIMORIYAMA_SPOT_ID = "d28ac6a2-7939-4698-986c-32ffe9f7e159";

const NEW_LAT = 37.490845;
const NEW_LNG = 139.92952;

const SUEHIRO_OLD = "売店では試飲もでき、併設の「蔵喫茶 杏」では、コーヒーやシフォンケーキなどを味わえます。";
const SUEHIRO_NEW = "売店では試飲もでき、併設の喫茶では、コーヒーやシフォンケーキなどを味わえます。";

const IIMORIYAMA_NEW =
  "戊辰戦争のさなか、慶応4年(1868)、戸ノ口原の戦いで敗れた白虎隊士中二番隊の少年たちが、この地で亡くなりました。のちに隊士の一人、飯沼貞吉が語り残したことで、その出来事は広く知られるようになりました。山の中腹には隊士の墓が並び、春と秋には墓前祭が行われます。境内には、国の重要文化財に指定されている栄螺堂(さざえ堂)もあります。石段や坂道があるので、足元に気をつけましょう。今も慰霊が続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const lunchSpot = await prisma.spot.findUnique({ where: { id: LUNCH_SPOT_ID } });
  const suehiro = await prisma.spot.findUnique({ where: { id: SUEHIRO_SPOT_ID } });
  const iimoriyama = await prisma.spot.findUnique({ where: { id: IIMORIYAMA_SPOT_ID } });
  if (!lunchSpot || !suehiro?.memo || !iimoriyama?.memo) throw new Error("想定と違います");
  if (!suehiro.memo.includes(SUEHIRO_OLD)) throw new Error("末廣酒造の置換対象が見つかりません");
  if (iimoriyama.memo === IIMORIYAMA_NEW) throw new Error("飯盛山のメモが想定外に一致");

  const newSuehiroMemo = suehiro.memo.replace(SUEHIRO_OLD, SUEHIRO_NEW);

  console.log("[確認OK] 鶴ヶ城周辺（昼食）の座標を直す:", lunchSpot.lat, lunchSpot.lng, "→", NEW_LAT, NEW_LNG);
  console.log("[確認OK] 末廣酒造から店名「蔵喫茶 杏」を外す");
  console.log("[確認OK] 飯盛山のメモを法務の例文に合わせて書き直す");
  console.log("新飯盛山メモ:", IIMORIYAMA_NEW);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const lunchPlace = await prisma.placeMaster.findFirst({ where: { name: LUNCH_PLACE_NAME } });
  if (lunchPlace) {
    await prisma.placeMaster.update({ where: { id: lunchPlace.id }, data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "gsi" } });
  }
  await prisma.spot.update({ where: { id: LUNCH_SPOT_ID }, data: { lat: NEW_LAT, lng: NEW_LNG } });
  await prisma.spot.update({ where: { id: SUEHIRO_SPOT_ID }, data: { memo: newSuehiroMemo } });
  await prisma.spot.update({ where: { id: IIMORIYAMA_SPOT_ID }, data: { memo: IIMORIYAMA_NEW } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
