/**
 * お遍路 本5(#13、40〜43番、範囲は変更なし)。対象はidで指定。
 *
 * 【新しいスポットの座標の出どころ】OSM直接確認(道の駅2件は全国の道の駅公式
 * サイト michi-no-eki.jp でも食事設備を確認済み)
 * - うわじまきさいや広場: OSM way 440436800 highway=services (33.222283, 132.558302)
 * - どんぶり館: OSM way 987595670 highway=services (33.3552036, 132.5274719)
 * - 宇和米博物館: OSM node 1423733874 tourism=museum (33.368208, 132.512223)
 * - 宇和民具館: OSM node 1423733858 tourism=museum (33.363916, 132.513942)
 * 台帳に既存の場所をそのまま再利用(id指定、座標はすでにOSM確認済み):
 * - 宇和島市立伊達博物館 dcd63f0a-4f62-45d2-8094-3620209845a3
 * - 宇和島市立歴史資料館 9b98ff1d-56d8-4f32-b47c-0fc4ada1d534
 * - 愛媛県歴史文化博物館 b4bd316d-50ab-42dd-a787-08909f0550a4
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book5.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book5.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const BOOK13_ID = "f22cbf27-466d-455e-90c5-3b4c6b9f1323";
const DAY1_ID = "fd3a4919-f4ed-44a8-a03f-446136906a9c";
const DAY2_ID = "c8e77b3c-f752-49df-b17f-d987c72fabf3";

const TENSHAEN_ID = "2a6616a3-0598-439e-953b-a5af9f4874c4";
const UNOMACHI_ID = "58696118-3c26-44c4-8d0f-167c99bc3620";

const DATE_MUSEUM_PLACE_ID = "dcd63f0a-4f62-45d2-8094-3620209845a3";
const REKISHI_PLACE_ID = "9b98ff1d-56d8-4f32-b47c-0fc4ada1d534";
const EHIME_MUSEUM_PLACE_ID = "b4bd316d-50ab-42dd-a787-08909f0550a4";

const TENSHAEN_MEMO_NO_LODGING =
  "寛文12年(1672)、宇和島藩2代藩主・伊達宗利が海を埋め立てて造った浜御殿の跡地に、7代藩主・伊達宗紀が隠居所として文久2〜3年(1862〜63)に着工し、慶応2年(1866)に完成させた池泉回遊式庭園です。国の名勝に指定されています。名前は、仙台藩祖・伊達政宗が詠んだ漢詩「酔余口号」の一節「残躯天所赦（残躯は天の赦す所）」に由来するとされ、宇和島伊達家と仙台伊達家のつながりを今に伝えています。園内には藤棚や、伊達家の家紋にちなむ竹が植えられ、四季折々の花が池に映ります。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  console.log("[確認OK] 本5(#13): 40〜43番(変更なし)に、実在の道の駅2件・博物館4件を追加して両日とも16:30に終わるようにする");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 日1: 宇和島城のあとにきさいや広場(昼食)→伊達博物館→天赦園(宿泊削除)→歴史資料館(宿泊追加) ---
  await prisma.spot.update({ where: { id: TENSHAEN_ID }, data: { orderNo: 94 } }); // 退避

  const kisaiyaPlace = await prisma.placeMaster.create({
    data: { name: "うわじまきさいや広場", address: "愛媛県宇和島市弁天町1-318-16", lat: 33.222283, lng: 132.558302, category: "other", source: "ai_collected", positionSource: "osm" },
  });
  const kisaiyaSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: kisaiyaPlace.id, orderNo: 4, name: "うわじまきさいや広場（昼食）",
      address: kisaiyaPlace.address, lat: kisaiyaPlace.lat, lng: kisaiyaPlace.lng,
      memo: "宇和島市にある道の駅です。レストランや軽食・喫茶があります。ここで昼食にしましょう。",
      visitTime: t(13, 3), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kisaiyaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });

  const datePlace = await prisma.placeMaster.findUnique({ where: { id: DATE_MUSEUM_PLACE_ID } });
  if (!datePlace) throw new Error("伊達博物館が見つかりません");
  const dateSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: DATE_MUSEUM_PLACE_ID, orderNo: 5, name: datePlace.name,
      address: datePlace.address, lat: datePlace.lat, lng: datePlace.lng,
      memo: "宇和島市にある、宇和島伊達家の歴史を伝える博物館です。甲冑や刀剣、古文書などの資料を展示しています。",
      visitTime: t(14, 6), stayDurationMin: 54,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: dateSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });

  await prisma.spot.update({ where: { id: TENSHAEN_ID }, data: { orderNo: 6, visitTime: t(15, 1), memo: TENSHAEN_MEMO_NO_LODGING } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: TENSHAEN_ID }, data: { transitDurationMin: 1 } });

  const rekishiPlace = await prisma.placeMaster.findUnique({ where: { id: REKISHI_PLACE_ID } });
  if (!rekishiPlace) throw new Error("歴史資料館が見つかりません");
  const rekishiSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: REKISHI_PLACE_ID, orderNo: 7, name: rekishiPlace.name,
      address: rekishiPlace.address, lat: rekishiPlace.lat, lng: rekishiPlace.lng,
      memo: "宇和島市の歴史を伝える資料館です。この日は、このあたりの宿に泊まりましょう。",
      visitTime: t(15, 55), stayDurationMin: 35,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: rekishiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 4 } });

  // --- 日2: 明石寺のあとにどんぶり館(昼食)→卯之町→宇和米博物館→宇和民具館→愛媛県歴史文化博物館 ---
  await prisma.spot.update({ where: { id: UNOMACHI_ID }, data: { orderNo: 94 } }); // 退避

  const donburiPlace = await prisma.placeMaster.create({
    data: { name: "どんぶり館", address: "愛媛県西予市宇和町稲生118", lat: 33.3552036, lng: 132.5274719, category: "other", source: "ai_collected", positionSource: "osm" },
  });
  const donburiSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: donburiPlace.id, orderNo: 4, name: "どんぶり館（昼食）",
      address: donburiPlace.address, lat: donburiPlace.lat, lng: donburiPlace.lng,
      memo: "西予市にある道の駅です。レストランがあります。ここで昼食にしましょう。",
      visitTime: t(12, 14), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: donburiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  await prisma.spot.update({ where: { id: UNOMACHI_ID }, data: { orderNo: 5, visitTime: t(13, 18) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: UNOMACHI_ID }, data: { transitDurationMin: 4 } });

  const komePlace = await prisma.placeMaster.create({
    data: { name: "宇和米博物館", address: "愛媛県西予市宇和町卯之町2丁目24", lat: 33.368208, lng: 132.512223, category: "museum", source: "ai_collected", positionSource: "osm" },
  });
  const komeSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: komePlace.id, orderNo: 6, name: "宇和米博物館",
      address: komePlace.address, lat: komePlace.lat, lng: komePlace.lng,
      memo: "西予市にある、米をテーマにした博物館です。旧宇和町小学校の校舎を生かしています。",
      visitTime: t(14, 34), stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: komeSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 1 } });

  const mingukanPlace = await prisma.placeMaster.create({
    data: { name: "宇和民具館", address: "愛媛県西予市宇和町卯之町", lat: 33.363916, lng: 132.513942, category: "museum", source: "ai_collected", positionSource: "osm" },
  });
  const mingukanSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: mingukanPlace.id, orderNo: 7, name: "宇和民具館",
      address: mingukanPlace.address, lat: mingukanPlace.lat, lng: mingukanPlace.lng,
      memo: "西予市にある、地域で使われてきた民具を紹介する資料館です。",
      visitTime: t(15, 16), stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: mingukanSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 2 } });

  const ehimePlace = await prisma.placeMaster.findUnique({ where: { id: EHIME_MUSEUM_PLACE_ID } });
  if (!ehimePlace) throw new Error("愛媛県歴史文化博物館が見つかりません");
  await prisma.placeMaster.update({ where: { id: EHIME_MUSEUM_PLACE_ID }, data: { positionSource: "osm" } });
  const ehimeSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: EHIME_MUSEUM_PLACE_ID, orderNo: 8, name: ehimePlace.name,
      address: ehimePlace.address, lat: ehimePlace.lat, lng: ehimePlace.lng,
      memo: "愛媛県の歴史や文化を紹介する県立の博物館です。",
      visitTime: t(15, 48), stayDurationMin: 42,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: ehimeSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 2 } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
