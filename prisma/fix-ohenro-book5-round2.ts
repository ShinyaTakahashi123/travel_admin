/**
 * お遍路 本5(#13)の2回目の直し(企画運営指摘、2026-10-14)。対象はidで指定。
 *
 * 【座標】OSM確認
 * - 龍光寺: node 811018694「第41番札所 龍光寺」(33.2952023, 132.5986435)
 * - 仏木寺: node 7677154349「仏木寺三十三観音霊場1番」(33.3110039, 132.5812872、
 *   境内にある三十三観音の1番。札所そのものの建物のタグは見当たらなかったが、
 *   境内にある実在の地物)
 * - 卯之町の町並みと開明学校: OSM node 1423744734「開明学校」(33.3644600, 132.5138250)
 * - 天赦園: OSM relation 18396899 leisure=garden(庭園の範囲)の代表点
 *   (33.2156051, 132.5612144)
 *
 * 【時刻】
 * - 観自在寺: 90分→60分に短縮。空いた30分は道の駅みしょうMICの滞在に
 *   (40→70分、24時間利用できる実在の道の駅のため)
 * - 伊達博物館→天赦園: 徒歩1分(0.2km)は短すぎたため、実際の近さ(約160m)
 *   に合わせて徒歩3分に
 * - 座標変更に伴い、該当区間をOSRM実測で確かめ直す
 *
 * 【本文】
 * - 愛媛県歴史文化博物館(この旅の最後)に帰路の一文を追加
 * - 宇和米博物館の「旧宇和町小学校の校舎を生かしています」は出典を確かめ
 *   られなかったため削除
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book5-round2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book5-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KANJIZAIJI_ID = "b1d0d9ae-3af9-4ac3-8e2f-dd398efc5098";
const RYUKOJI_ID = "2bd871fb-81cf-4a10-9975-38763ded97bb";
const BUTSUMOKUJI_ID = "45097d3b-f391-4ffc-90d4-cdebc0252241";
const MEISEKIJI_ID = "b761b70c-6b62-4bc9-8739-fc61a7f4c28a";
const UNOMACHI_ID = "58696118-3c26-44c4-8d0f-167c99bc3620";
const TENSHAEN_ID = "2a6616a3-0598-439e-953b-a5af9f4874c4";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const misho = await prisma.spot.findUnique({ where: { id: KANJIZAIJI_ID } });
  if (!misho) throw new Error("想定と違います");
  const kisaiya = await prisma.spot.findFirst({ where: { name: "うわじまきさいや広場（昼食）" } });
  const date = await prisma.spot.findFirst({ where: { name: "宇和島市立伊達博物館", dayId: kisaiya?.dayId } });
  const rekishi = await prisma.spot.findFirst({ where: { name: "宇和島市立歴史資料館" } });
  const komeSpot = await prisma.spot.findFirst({ where: { name: "宇和米博物館" } });
  const ehimeSpot = await prisma.spot.findFirst({ where: { name: "愛媛県歴史文化博物館" } });
  const mishoMicSpot = await prisma.spot.findFirst({ where: { name: "道の駅みしょうMIC" } });
  if (!kisaiya || !date || !rekishi || !komeSpot || !ehimeSpot || !mishoMicSpot) throw new Error("想定と違います(新設スポット)");

  console.log("[確認OK] 龍光寺・仏木寺・卯之町・天赦園の座標をOSMの地物に修正");
  console.log("[確認OK] 観自在寺60分・みしょうMIC70分、天赦園への脚を徒歩3分に、時刻を組み直す");
  console.log("[確認OK] 愛媛県歴史文化博物館に帰路の一文、宇和米博物館の出典不明な一文を削除");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 座標 ---
  const ryukoji = await prisma.spot.findUnique({ where: { id: RYUKOJI_ID } });
  if (ryukoji?.placeMasterId) await prisma.placeMaster.update({ where: { id: ryukoji.placeMasterId }, data: { lat: 33.2952023, lng: 132.5986435, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: RYUKOJI_ID }, data: { lat: 33.2952023, lng: 132.5986435 } });

  const butsumokuji = await prisma.spot.findUnique({ where: { id: BUTSUMOKUJI_ID } });
  if (butsumokuji?.placeMasterId) await prisma.placeMaster.update({ where: { id: butsumokuji.placeMasterId }, data: { lat: 33.3110039, lng: 132.5812872, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: BUTSUMOKUJI_ID }, data: { lat: 33.3110039, lng: 132.5812872 } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: BUTSUMOKUJI_ID }, data: { transitDurationMin: 5 } });

  const unomachi = await prisma.spot.findUnique({ where: { id: UNOMACHI_ID } });
  if (unomachi?.placeMasterId) await prisma.placeMaster.update({ where: { id: unomachi.placeMasterId }, data: { lat: 33.36446, lng: 132.513825, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: UNOMACHI_ID }, data: { lat: 33.36446, lng: 132.513825 } });

  const tenshaen = await prisma.spot.findUnique({ where: { id: TENSHAEN_ID } });
  if (tenshaen?.placeMasterId) await prisma.placeMaster.update({ where: { id: tenshaen.placeMasterId }, data: { lat: 33.2156051, lng: 132.5612144, positionSource: "osm" } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: TENSHAEN_ID }, data: { transitMode: "walk", transitDurationMin: 3 } });

  // --- 日1 時刻 ---
  await prisma.spot.update({ where: { id: KANJIZAIJI_ID }, data: { stayDurationMin: 60 } }); // 09:00-10:00
  await prisma.spot.update({ where: { id: mishoMicSpot.id }, data: { visitTime: t(10, 5), stayDurationMin: 70 } }); // 10:05-11:15
  await prisma.spot.update({ where: { id: tenshaen!.id }, data: { lat: 33.2156051, lng: 132.5612144, visitTime: t(15, 3) } });
  await prisma.spot.update({ where: { id: rekishi.id }, data: { visitTime: t(15, 57) } });

  // --- 日2 時刻(座標変更に伴う区間の見直し) ---
  await prisma.spot.update({ where: { id: BUTSUMOKUJI_ID }, data: { visitTime: t(9, 50) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: MEISEKIJI_ID }, data: { transitDurationMin: 15 } });
  await prisma.spot.update({ where: { id: MEISEKIJI_ID }, data: { visitTime: t(10, 45) } });

  const donburi = await prisma.spot.findFirst({ where: { name: "どんぶり館（昼食）" } });
  if (!donburi) throw new Error("どんぶり館が見つかりません");
  await prisma.spot.update({ where: { id: donburi.id }, data: { visitTime: t(12, 5) } });

  await prisma.spotTransitLeg.updateMany({ where: { spotId: UNOMACHI_ID }, data: { transitDurationMin: 3 } });
  await prisma.spot.update({ where: { id: UNOMACHI_ID }, data: { visitTime: t(13, 8) } });

  await prisma.spotTransitLeg.updateMany({ where: { spotId: komeSpot.id }, data: { transitDurationMin: 2 } });
  await prisma.spot.update({ where: { id: komeSpot.id }, data: { visitTime: t(14, 25) } });

  const mingukan = await prisma.spot.findFirst({ where: { name: "宇和民具館" } });
  if (!mingukan) throw new Error("宇和民具館が見つかりません");
  await prisma.spot.update({ where: { id: mingukan.id }, data: { visitTime: t(15, 7) } });

  await prisma.spot.update({
    where: { id: ehimeSpot.id },
    data: {
      visitTime: t(15, 39), stayDurationMin: 51,
      memo: "愛媛県の歴史や文化を紹介する県立の博物館です。見学を終えたら、帰路につきましょう。",
    },
  });
  await prisma.spot.update({
    where: { id: komeSpot.id },
    data: { memo: "西予市にある、米をテーマにした博物館です。" },
  });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
