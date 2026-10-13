/**
 * #35の直し(自己点検)。fix4で日本庭園・表参道の滞在を短縮した際、後ろの
 * スポット(奥の院・表参道（昼食）・表参道(門前商店街))のvisitTimeを再計算
 * し忘れており、表参道(門前商店街)の終わり(15:28)が肥前浜宿酒蔵通りの開始
 * (15:23)より後になる重なりが生じていた。正しい時刻に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const OKUNOIN_SPOT_ID = "ee1068f8-ccdf-4f0f-b8dc-d7ed49406698";
const LUNCH_SPOT_ID_NAME = "表参道（昼食）";
const OMOTESANDO_SPOT_ID = "e40054ed-cd45-4b23-85d1-de488c5aa8b6";
const DAY_ID = "2dee8038-3148-4f2a-b192-f03fe6f1fad4";

async function main() {
  const okunoin = await prisma.spot.findUnique({ where: { id: OKUNOIN_SPOT_ID } });
  const lunch = await prisma.spot.findFirst({ where: { name: LUNCH_SPOT_ID_NAME, dayId: DAY_ID } });
  const omotesando = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID } });
  if (!okunoin || !lunch || !omotesando) throw new Error("想定と違います");

  const newOkunoinTime = new Date(Date.UTC(1970, 0, 1, 11, 55));
  const newLunchTime = new Date(Date.UTC(1970, 0, 1, 13, 20));
  const newOmotesandoTime = new Date(Date.UTC(1970, 0, 1, 14, 18));

  console.log("[確認OK] 奥の院:", okunoin.visitTime?.toISOString().slice(11, 16), "→ 11:55");
  console.log("[確認OK] 表参道（昼食）:", lunch.visitTime?.toISOString().slice(11, 16), "→ 13:20");
  console.log("[確認OK] 表参道(門前商店街):", omotesando.visitTime?.toISOString().slice(11, 16), "→ 14:18");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: OKUNOIN_SPOT_ID }, data: { visitTime: newOkunoinTime } });
  await prisma.spot.update({ where: { id: lunch.id }, data: { visitTime: newLunchTime } });
  await prisma.spot.update({ where: { id: OMOTESANDO_SPOT_ID }, data: { visitTime: newOmotesandoTime } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
