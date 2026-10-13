/**
 * #5の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 浮羽稲荷神社のメモから「ご利益」という言い方を削除(使わない決まり)
 * 2. 道の駅うきは（昼食）の座標が台帳から使い回した丸めた値(33.334300, 130.818500)
 *    だったため、OSMの建物の点(33.3341691, 130.8178970、「道の駅　うきは」の建物
 *    way id 921172063の頂点)に直す。台帳(place_master)の座標も同じ値に直す
 *    (他の承認待ちしおりが同じ台帳につながっている場合に備える)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const INARI_SPOT_ID = "ff95b30e-fc83-4e44-95b3-93d82271e1f0";
const MICHINOEKI_PM_ID = "165cda28-4e86-4076-a6fa-ef486623d188";
const MICHINOEKI_SPOT_ID_21141835 = "__TBD__"; // 確認時に埋める

const NEW_LAT = 33.3341691;
const NEW_LNG = 130.817897;

async function main() {
  const inari = await prisma.spot.findUnique({ where: { id: INARI_SPOT_ID } });
  if (!inari?.memo) throw new Error("想定と違います");
  const newInariMemo = inari.memo.replace(
    "商売繁盛や学問などのご利益があるとされます。",
    "商売繁盛や学問の神として祀られています。"
  );
  if (newInariMemo === inari.memo) throw new Error("置換対象(ご利益)が見つかりません");

  const pm = await prisma.placeMaster.findUnique({ where: { id: MICHINOEKI_PM_ID } });
  if (!pm) throw new Error("台帳が見つかりません");
  console.log("台帳(道の駅うきは)の現在値:", pm.lat, pm.lng);

  const linkedSpots = await prisma.spot.findMany({ where: { placeMasterId: MICHINOEKI_PM_ID } });
  console.log("この台帳につながる全スポット:");
  for (const s of linkedSpots) {
    console.log(" -", s.id, s.dayId, s.name, s.lat, s.lng);
  }

  console.log("\n[確認OK] 浮羽稲荷神社のメモから「ご利益」を削除");
  console.log("[確認OK] 台帳(道の駅うきは)の座標をOSM実点に直す");
  console.log("[確認OK] この台帳につながる全スポットの座標も同じ値に直す(上のリストの件数ぶん)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: INARI_SPOT_ID }, data: { memo: newInariMemo } });
  await prisma.placeMaster.update({ where: { id: MICHINOEKI_PM_ID }, data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "osm" } });
  for (const s of linkedSpots) {
    await prisma.spot.update({ where: { id: s.id }, data: { lat: NEW_LAT, lng: NEW_LNG } });
  }

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
