/**
 * #113 79db7413の直し(2回目)。itinerary-audit.cjsで、既存スポット
 * (大沼国定公園09:30開始・函館朝市08:30開始)の実際の開始時刻が、
 * 自分が仮定していた09:00と違っていたため、下流すべてのvisitTimeが
 * ずれていた。正しい開始時刻から計算し直す。
 *
 * Day1: 大沼国定公園(09:30,100分,既存)→大沼遊船(55分)→鹿部間歇泉
 *   (65分)→五稜郭公園(55分)→五稜郭タワー(75分)、16:34終了
 * Day2: 函館朝市(08:30,50分,既存)→摩周丸(40分)→赤レンガ倉庫(70分)→
 *   まちセン(30分)→北方民族資料館(45分)→旧イギリス領事館(35分)→
 *   旧函館区公会堂(40分)→カトリック元町教会(20分)→聖ヨハネ教会(20分)
 *   →ハリストス正教会(25分)→八幡坂(15分)→文学館(45分)、16:32終了
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '79db7413%'`);
  const itinId = rows[0].id;

  const onumaYusen = await findSpotInItinerary(itinId, { spotName: "大沼遊船" });
  const shikabe = await findSpotInItinerary(itinId, { spotName: "鹿部間歇泉" });
  const goryokakuKoen = await findSpotInItinerary(itinId, { spotName: "五稜郭公園" });
  const goryokakuTower = await findSpotInItinerary(itinId, { spotName: "五稜郭タワー" });

  const mashumaru = await findSpotInItinerary(itinId, { spotName: "青函連絡船記念館摩周丸" });
  const akarenga = await findSpotInItinerary(itinId, { spotName: "金森赤レンガ倉庫" });
  const machicenter = await findSpotInItinerary(itinId, { spotName: "函館市地域交流まちづくりセンター" });
  const hoppou = await findSpotInItinerary(itinId, { spotName: "函館市北方民族資料館" });
  const eikoku = await findSpotInItinerary(itinId, { spotName: "旧イギリス領事館" });
  const kokaido = await findSpotInItinerary(itinId, { spotName: "旧函館区公会堂" });
  const catholic = await findSpotInItinerary(itinId, { spotName: "カトリック元町教会" });
  const johane = await findSpotInItinerary(itinId, { spotName: "函館聖ヨハネ教会" });
  const harisutosu = await findSpotInItinerary(itinId, { spotName: "函館ハリストス正教会" });
  const hachimanzaka = await findSpotInItinerary(itinId, { spotName: "八幡坂" });
  const bungakukan = await findSpotInItinerary(itinId, { spotName: "函館市文学館" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: onumaYusen.id }, { visitTime: t(11, 17), stayDurationMin: 55 });
  await updateSpotInItinerary(itinId, { spotId: shikabe.id }, { visitTime: t(12, 34), stayDurationMin: 65 });
  await updateSpotInItinerary(itinId, { spotId: goryokakuKoen.id }, { visitTime: t(14, 19), stayDurationMin: 55 });
  await updateSpotInItinerary(itinId, { spotId: goryokakuTower.id }, { visitTime: t(15, 19), stayDurationMin: 75 });

  await updateSpotInItinerary(itinId, { spotId: mashumaru.id }, { visitTime: t(9, 24) });
  await updateSpotInItinerary(itinId, { spotId: akarenga.id }, { visitTime: t(10, 15), stayDurationMin: 70 });
  await updateSpotInItinerary(itinId, { spotId: machicenter.id }, { visitTime: t(11, 29) });
  await updateSpotInItinerary(itinId, { spotId: hoppou.id }, { visitTime: t(12, 7), stayDurationMin: 45 });
  await updateSpotInItinerary(itinId, { spotId: eikoku.id }, { visitTime: t(12, 55) });
  await updateSpotInItinerary(itinId, { spotId: kokaido.id }, { visitTime: t(13, 33) });
  await updateSpotInItinerary(itinId, { spotId: catholic.id }, { visitTime: t(14, 18) });
  await updateSpotInItinerary(itinId, { spotId: johane.id }, { visitTime: t(14, 40) });
  await updateSpotInItinerary(itinId, { spotId: harisutosu.id }, { visitTime: t(15, 1) });
  await updateSpotInItinerary(itinId, { spotId: hachimanzaka.id }, { visitTime: t(15, 29) });
  await updateSpotInItinerary(itinId, { spotId: bungakukan.id }, { visitTime: t(15, 47), stayDurationMin: 45 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
