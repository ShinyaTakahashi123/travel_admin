/**
 * お遍路 本4(#11)の2回目の直し(企画運営指摘、2026-10-14)。対象はすべてidで指定。
 * 1. 日1: 桂浜・34種間寺・35清瀧寺・36青龍寺の時刻を書き換え忘れていたため、
 *    帷子崎展望所(12:53開始)が青龍寺(12:40-13:30)の終わりより前になっていた
 *    (時刻の逆行)。正しく組み直す
 * 2. 日2: めじかの里土佐清水(昼食)を34分→60分に(うみのわ以降の時刻も直す)
 * 3. 日3: ジョン万次郎資料館の開始を09:40→09:50に(白山洞門の終わり09:35+15分)
 * 4. 日3: 延光寺を90分→60分に短縮し、空いた30分を単一スポットに集中させず、
 *    道の駅すくも・咸陽島・大堂海岸に10分ずつ分けて足す
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book4-round2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book4-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KATSURAHAMA_ID = "59b26b8c-31e7-4b3f-8e2d-f12971f2f70e";
const TANEMAJI_ID = "c6014e73-32b2-46b2-8057-42c3b1063133";
const KIYOTAKIJI_ID = "a555341e-a605-4d2e-8a0e-d02a515b5f1b";
const SHORYUJI_ID = "8fd11d0c-3461-4449-a871-3059022dfeda";

const KONGOFUKUJI_ID = "55eab58b-cc26-42fb-ae4b-d0fea6ba58f9";
const ASHIZURI_TODAI_ID = "f22745fa-e270-4395-aad5-adbbd1141336";

const MANJIRO_ID = "ca71aa3c-a53c-4fd6-ad90-dfecbb2a9579";
const ENKOJI_ID = "a0f96af0-7b90-44d2-bc32-5e7edc4eb9e8";
const KANYOJIMA_ID = "308169a9-e3e9-4935-82f9-942fdea4c002";
const ODODAN_ID = "d263181f-3686-4296-8b81-3757f9b99771";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const mejika = await prisma.spot.findFirst({ where: { name: "道の駅めじかの里土佐清水（昼食）", dayId: (await prisma.spot.findUnique({ where: { id: KONGOFUKUJI_ID } }))?.dayId } });
  const uminowa = await prisma.spot.findFirst({ where: { name: "足摺宇和海国立公園竜串ビジターセンターうみのわ", dayId: mejika?.dayId } });
  if (!mejika || !uminowa) throw new Error("想定と違います(めじか・うみのわが見つからない)");

  const katsurahama = await prisma.spot.findUnique({ where: { id: KATSURAHAMA_ID } });
  if (!katsurahama) throw new Error("想定と違います");

  console.log("[確認OK] 日1: 桂浜・34・35・36の時刻を組み直す(帷子崎以降とつながるように)");
  console.log("[確認OK] 日2: めじかの里を60分に、うみのわ以降の時刻を直す");
  console.log("[確認OK] 日3: ジョン万次郎09:50開始に修正、延光寺60分に短縮、すくも・咸陽島・大堂海岸に10分ずつ");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 日1 ---
  await prisma.spot.update({ where: { id: KATSURAHAMA_ID }, data: { visitTime: t(9, 0), stayDurationMin: 35 } });
  await prisma.spot.update({ where: { id: TANEMAJI_ID }, data: { visitTime: t(9, 55) } });
  await prisma.spot.update({ where: { id: KIYOTAKIJI_ID }, data: { visitTime: t(10, 50), stayDurationMin: 45 } });
  await prisma.spot.update({ where: { id: SHORYUJI_ID }, data: { visitTime: t(11, 55) } });

  // --- 日2 ---
  await prisma.spot.update({ where: { id: mejika.id }, data: { stayDurationMin: 60 } }); // 12:58-13:58
  await prisma.spot.update({ where: { id: uminowa.id }, data: { visitTime: t(14, 0) } }); // +2分
  await prisma.spot.update({ where: { id: KONGOFUKUJI_ID }, data: { visitTime: t(14, 41), stayDurationMin: 45 } });
  await prisma.spot.update({ where: { id: ASHIZURI_TODAI_ID }, data: { visitTime: t(15, 36), stayDurationMin: 54 } });

  // --- 日3 ---
  await prisma.spot.update({ where: { id: MANJIRO_ID }, data: { visitTime: t(9, 50) } });
  await prisma.spot.update({ where: { id: ENKOJI_ID }, data: { visitTime: t(11, 39), stayDurationMin: 60 } });

  const sukumo = await prisma.spot.findFirst({ where: { name: "道の駅すくも（昼食）" } });
  if (!sukumo) throw new Error("想定と違います(すくもが見つからない)");
  await prisma.spot.update({ where: { id: sukumo.id }, data: { visitTime: t(12, 49), stayDurationMin: 70 } });
  await prisma.spot.update({ where: { id: KANYOJIMA_ID }, data: { visitTime: t(14, 8), stayDurationMin: 60 } });
  await prisma.spot.update({ where: { id: ODODAN_ID }, data: { visitTime: t(15, 33), stayDurationMin: 80 } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
