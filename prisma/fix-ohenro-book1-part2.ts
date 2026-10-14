/**
 * fix-ohenro-book1.ts の実行が、安楽寺を日2へ移す直前(日2の既存スポットの
 * orderNoを先にずらし忘れたため)に一意制約エラーで止まった。日1側は正しく
 * 直っている(確認済み)。ここでは、日2側の残り(安楽寺の移動・どなり追加・
 * 会館追加・各時刻)だけを行う。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book1-part2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book1-part2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY1_ID = "181ad257-d64c-413e-9396-6f66d355a939";
const DAY2_ID = "299d6794-cad5-496b-b1f8-344b8710ba5a";

const ANRAKUJI_ID = "6479b3bb-66d9-46fb-9e7a-fc36c632f561";
const JURAKUJI_ID = "5980acd4-eef4-4517-8c3c-20208b635af9";
const KUMADANIJI_ID = "c545894d-7596-4b44-9457-e87eac3de963";
const HORINJI_ID = "08781d22-0944-4065-acec-94f056b0df1f";
const KIRIHATAJI_ID = "a3e39d83-1d07-4b0a-9d06-c975f7732012";
const FUJIIDERA_ID = "269dbad6-dd51-4397-83ca-3d984432069a";

const ANRAKUJI_MEMO_NEW =
  "弘仁6年(815)、弘法大師がこの地で、病に苦しむ人々を救うために薬師如来を自ら刻んで開いたと伝えられます。修行中の弘法大師を狩人が誤って弓で射てしまい、矢は近くの松に当たったという言い伝えがあり、大師はその松を逆さに植え、「この松が栄えるかぎり参拝者に災いはない」と告げたとされる「逆松」が今も伝わります。山号の「温泉山」が示すとおり、境内には四国霊場で数少ない温泉が湧き、江戸時代から続く宿坊の温泉で旅の疲れを癒やせます（入浴できるかどうかや時間は公式で確かめてください）。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const anrakuji = await prisma.spot.findUnique({ where: { id: ANRAKUJI_ID }, include: { transitLegs: true } });
  const juraku = await prisma.spot.findUnique({ where: { id: JURAKUJI_ID } });
  if (!anrakuji || anrakuji.dayId !== DAY1_ID || anrakuji.orderNo !== 98) throw new Error("想定と違います(安楽寺が既に移動済みの可能性)");
  if (!juraku || juraku.dayId !== DAY2_ID || juraku.orderNo !== 1) throw new Error("想定と違います(十楽寺が既に移動済みの可能性)");
  if (anrakuji.transitLegs.length !== 0) throw new Error("想定と違います(安楽寺の脚が残っている)");

  console.log("[確認OK] 現在の状態は想定どおり(日1に安楽寺orderNo98が残留、日2は未変更)");
  console.log("[確認OK] 日2を作り直す: 安楽寺→十楽寺→熊谷寺→法輪寺→どなり(昼食)→切幡寺→藤井寺→阿波和紙伝統産業会館");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

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

  // 日2の既存5件を退避
  await prisma.spot.update({ where: { id: JURAKUJI_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: KUMADANIJI_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: HORINJI_ID }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: KIRIHATAJI_ID }, data: { orderNo: 95 } });
  await prisma.spot.update({ where: { id: FUJIIDERA_ID }, data: { orderNo: 96 } });

  // 安楽寺を日2の先頭へ
  await prisma.spot.update({
    where: { id: ANRAKUJI_ID },
    data: { dayId: DAY2_ID, orderNo: 1, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)), memo: ANRAKUJI_MEMO_NEW },
  });

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
