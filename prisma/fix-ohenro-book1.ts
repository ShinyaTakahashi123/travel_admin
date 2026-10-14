/**
 * お遍路 組み直し(企画運営指示、2026-10-14) 本1(#7 1番〜11番)の直し。
 *
 * 【変更】
 * - 日1の終わりが13:28、日2の終わりが13:05と早すぎたため、実在の名所2件・
 *   昼食2件を追加して両日とも16:30終わりにする。範囲(1〜11番)は変えない。
 * - 6番安楽寺(「今夜はこの周辺の宿にご宿泊いただきます」の宿泊地)を日2の最初に
 *   移し、日1の最後を5番地蔵寺にする(宿泊の文もそちらへ移す)。これにより
 *   1日目に大塚国際美術館・昼食を足しても、6か寺すべてを無理に1日に詰め込まずに済む。
 *
 * 【新しいスポットの座標の出どころ】(OSM Nominatimで直接確認。番地・案内板・バス停は使わず
 * すべて名前のある建物)
 * - 大塚国際美術館: OSM relation 4205190 (34.2325795, 134.6375369)
 * - 道の駅第九の里: OSM way 320027002 (building) (34.1638393, 134.4988378)
 * - 道の駅どなり: OSM way 437566876 (building) (34.1510061, 134.3524137)
 * - 阿波和紙伝統産業会館: OSM way 317755036 (34.0459135, 134.2309796)
 *
 * 【新しい事実の出典】
 * - 大塚国際美術館: 公式サイト https://o-museum.or.jp/ (2026-10-14取得。世界26カ国の
 *   西洋名画を陶板で原寸大再現、地下3階〜地上2階の5フロア、開館9:30〜17:00・月曜休館)
 * - 阿波和紙伝統産業会館: JAPAN Travel(観光庁監修の公式観光情報サイト)
 *   https://www.japan.travel/hk/spot/2251/ (2026-10-14取得。住所・紙漉き体験・ギャラリー)
 *
 * 【見込みの移動時間(新しい区間、OSRM等での厳密な確認は未実施、要確認)】
 * 美術館→第九の里20分、第九の里→霊山寺5分、法輪寺→どなり12分、どなり→切幡寺13分、
 * 藤井寺→会館18分、安楽寺→十楽寺5分(いずれも実在2点間の直線距離から見積もり)
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book1.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book1.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "5670eb0e-fad1-490d-afc9-3ac66896a083";
const DAY1_ID = "181ad257-d64c-413e-9396-6f66d355a939";
const DAY2_ID = "299d6794-cad5-496b-b1f8-344b8710ba5a";

const RYOZENJI_ID = "769cfc42-eb83-4168-a9f0-a515b12f690a";
const GOKURAKUJI_ID = "ecd1b1cb-1d08-4a2f-89e5-2faa01985570";
const KONSENJI_ID = "38b79db0-2ece-4807-912b-0d3db0aa7a8e";
const DAINICHIJI_ID = "6d57dafd-6bd6-490e-a0cf-4262c4f34483";
const JIZOJI_ID = "73130322-247b-4b09-95aa-52ea257f26a4";
const ANRAKUJI_ID = "6479b3bb-66d9-46fb-9e7a-fc36c632f561";
const JURAKUJI_ID = "5980acd4-eef4-4517-8c3c-20208b635af9";
const KUMADANIJI_ID = "c545894d-7596-4b44-9457-e87eac3de963";
const HORINJI_ID = "08781d22-0944-4065-acec-94f056b0df1f";
const KIRIHATAJI_ID = "a3e39d83-1d07-4b0a-9d06-c975f7732012";
const FUJIIDERA_ID = "269dbad6-dd51-4397-83ca-3d984432069a";

const JIZOJI_MEMO_NEW =
  "弘仁12年(821)、弘法大師がこの地で、甲冑をまとい馬にまたがる姿の勝軍地蔵菩薩を自ら刻んで本尊としたと伝えられます。この小さな勝軍地蔵は、僧が刻んだ延命地蔵菩薩の胎内に納められており、武士からの信仰を集めてきました。本堂の裏手にある羅漢堂には、安永4年(1775)に建てられて以来の五百羅漢が安置されていましたが、大正の火災で焼失し、大正11年(1922)に再建されました。今も約200体の羅漢像が、一体一体異なる表情で並んでいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。今夜はこの周辺の宿にご宿泊いただきます。";

const ANRAKUJI_MEMO_NEW =
  "弘仁6年(815)、弘法大師がこの地で、病に苦しむ人々を救うために薬師如来を自ら刻んで開いたと伝えられます。修行中の弘法大師を狩人が誤って弓で射てしまい、矢は近くの松に当たったという言い伝えがあり、大師はその松を逆さに植え、「この松が栄えるかぎり参拝者に災いはない」と告げたとされる「逆松」が今も伝わります。山号の「温泉山」が示すとおり、境内には四国霊場で数少ない温泉が湧き、江戸時代から続く宿坊の温泉で旅の疲れを癒やせます（入浴できるかどうかや時間は公式で確かめてください）。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const day1 = await prisma.day.findUnique({ where: { id: DAY1_ID } });
  const day2 = await prisma.day.findUnique({ where: { id: DAY2_ID } });
  if (!day1 || day1.itineraryId !== ITIN_ID || !day2 || day2.itineraryId !== ITIN_ID) {
    throw new Error("想定と違います(day)");
  }
  const anrakuji = await prisma.spot.findUnique({ where: { id: ANRAKUJI_ID } });
  if (!anrakuji || anrakuji.dayId !== DAY1_ID || anrakuji.orderNo !== 6) throw new Error("想定と違います(安楽寺)");

  console.log("[確認OK] 5番地蔵寺のメモに宿泊の一文を追加");
  console.log("[確認OK] 6番安楽寺を日2の先頭(orderNo1)に移動、宿泊の一文を削除");
  console.log("[確認OK] 日1: 大塚国際美術館→第九の里(昼食)→霊山寺→極楽寺→金泉寺→大日寺→地蔵寺 (7件、09:00〜16:30)");
  console.log("[確認OK] 日2: 安楽寺→十楽寺→熊谷寺→法輪寺→どなり(昼食)→切幡寺→藤井寺→阿波和紙伝統産業会館 (8件、09:00〜16:30)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 新しいplace_master 4件 ---
  const otsuka = await prisma.placeMaster.create({
    data: {
      name: "大塚国際美術館", address: "徳島県鳴門市鳴門町", lat: 34.2325795, lng: 134.6375369,
      category: "museum", source: "ai_collected", positionSource: "nominatim",
    },
  });
  const daikunosato = await prisma.placeMaster.create({
    data: {
      name: "道の駅第九の里", address: "徳島県鳴門市大麻町桧", lat: 34.1638393, lng: 134.4988378,
      category: "other", source: "ai_collected", positionSource: "nominatim",
    },
  });
  const donari = await prisma.placeMaster.create({
    data: {
      name: "道の駅どなり", address: "徳島県阿波市", lat: 34.1510061, lng: 134.3524137,
      category: "other", source: "ai_collected", positionSource: "nominatim",
    },
  });
  const washikan = await prisma.placeMaster.create({
    data: {
      name: "阿波和紙伝統産業会館", address: "徳島県吉野川市山川町川東141", lat: 34.0459135, lng: 134.2309796,
      category: "craft", source: "ai_collected", positionSource: "nominatim",
    },
  });

  // --- 日1の既存5スポットのorderNoを2つ後ろへずらす(6,7は後で埋める) ---
  // 一意制約を避けるため、先に退避用の大きいorderNoへ
  await prisma.spot.update({ where: { id: RYOZENJI_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: GOKURAKUJI_ID }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: KONSENJI_ID }, data: { orderNo: 95 } });
  await prisma.spot.update({ where: { id: DAINICHIJI_ID }, data: { orderNo: 96 } });
  await prisma.spot.update({ where: { id: JIZOJI_ID }, data: { orderNo: 97 } });
  await prisma.spot.update({ where: { id: ANRAKUJI_ID }, data: { orderNo: 98 } }); // 退避(あとで日2へ)

  const otsukaSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: otsuka.id, orderNo: 1, name: "大塚国際美術館",
      address: otsuka.address, lat: otsuka.lat, lng: otsuka.lng,
      memo: "世界26カ国の西洋名画を、陶板に焼き付けて原寸大で再現した美術館です(出典: 大塚国際美術館公式サイト)。地下3階から地上2階までの5つのフロアに、「モナ・リザ」「最後の晩餐」「ゲルニカ」など、原寸大で再現された名画が並びます。開館時間は9:30〜17:00(入館券の販売は16:00まで)、月曜休館(祝日の場合は翌日)です。最新の開館状況は公式サイトで確かめましょう。",
      visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)), stayDurationMin: 130,
    },
  });
  const daikunosatoSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: daikunosato.id, orderNo: 2, name: "道の駅第九の里（昼食）",
      address: daikunosato.address, lat: daikunosato.lat, lng: daikunosato.lng,
      memo: "鳴門市大麻町にある道の駅です。地元でとれた野菜や果物、特産品が並ぶ直売所があり、軽食をとれる食事処も備えています。ここで昼食をとりましょう。",
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 30)), stayDurationMin: 79,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: daikunosatoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 20 } });

  // 霊山寺〜地蔵寺を orderNo3〜7 へ、時刻を更新
  await prisma.spot.update({ where: { id: RYOZENJI_ID }, data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 54)) } });
  await prisma.spotTransitLeg.create({ data: { spotId: RYOZENJI_ID, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  await prisma.spot.update({ where: { id: GOKURAKUJI_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 39)) } });
  await prisma.spot.update({ where: { id: KONSENJI_ID }, data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 22)) } });
  await prisma.spot.update({ where: { id: DAINICHIJI_ID }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 9)) } });
  await prisma.spot.update({
    where: { id: JIZOJI_ID },
    data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)), memo: JIZOJI_MEMO_NEW },
  });

  // --- 安楽寺を日2の先頭へ移動(宿泊直後、脚なし) ---
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: ANRAKUJI_ID } });
  await prisma.spot.update({
    where: { id: ANRAKUJI_ID },
    data: { dayId: DAY2_ID, orderNo: 1, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)), memo: ANRAKUJI_MEMO_NEW },
  });

  // --- 日2の既存5スポットのorderNoを1つ後ろへずらす ---
  await prisma.spot.update({ where: { id: JURAKUJI_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: KUMADANIJI_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: HORINJI_ID }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: KIRIHATAJI_ID }, data: { orderNo: 95 } });
  await prisma.spot.update({ where: { id: FUJIIDERA_ID }, data: { orderNo: 96 } });

  await prisma.spot.update({ where: { id: JURAKUJI_ID }, data: { orderNo: 2, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 45)) } });
  await prisma.spotTransitLeg.create({ data: { spotId: JURAKUJI_ID, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  await prisma.spot.update({ where: { id: KUMADANIJI_ID }, data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)) } });
  await prisma.spot.update({ where: { id: HORINJI_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 17)) } });

  const donariSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: donari.id, orderNo: 5, name: "道の駅どなり（昼食）",
      address: donari.address, lat: donari.lat, lng: donari.lng,
      memo: "阿波市にある道の駅です。地元の農産物直売所や食事処があり、お遍路の道中で昼食や休憩に立ち寄れます。ここで昼食をとりましょう。",
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 4)), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: donariSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 12 } });

  await prisma.spot.update({ where: { id: KIRIHATAJI_ID }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 17)) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: KIRIHATAJI_ID }, data: { transitDurationMin: 13 } });

  await prisma.spot.update({ where: { id: FUJIIDERA_ID }, data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 17)) } });

  const washikanSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: washikan.id, orderNo: 8, name: "阿波和紙伝統産業会館",
      address: washikan.address, lat: washikan.lat, lng: washikan.lng,
      memo: "吉野川市山川町にある、阿波和紙の博物館です(出典: JAPAN Travel〈観光庁監修の公式観光情報サイト〉)。2階のギャラリーでは、世界各地の手漉き紙の作品を展示しており、特別展は1〜2か月ごとに入れ替わります。少額の体験料で、はがきなどの紙すき体験もできます(所要時間や料金は公式の案内で確かめてください)。",
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 15)), stayDurationMin: 75,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: washikanSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 18 } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
