/**
 * 承認待ちしおりの見直し・新しい地域の分#25(a54e45e0、水天宮と石橋文化センター、
 * 田主丸のかっぱとワイナリー)。4か所以上・9:30ごろ〜16:30〜17:00の決まりに合わせ、
 * 新たに2か所(御井町周辺（昼食）・高良大社)を追加する。
 *
 * - 石橋文化センター: 「入園料・観覧料や開園時間は...確かめてください」というお金の
 *   話と「ください」を削除
 * - 高良大社: 筑後国一の宮。創建伝承・祭神・本殿の建立年・国重要文化財指定・
 *   孟宗金明竹林(国天然記念物)を観光情報サイトで確認(crossroadfukuoka.jp等)。
 *   座標はOSMの「高良神社 駐車場」の実点を使用(本殿そのものの点は見つからず)
 * - 御井町周辺（昼食）: 高良大社のふもとに実在する食堂(やなぎ亭など)を確認した上で、
 *   店名は出さずエリア案内の形にする
 * - 巨峰ワイナリー: 「営業日・営業時間は...確かめてください」の「ください」を直す
 * - 田主丸駅とかっぱの町並み: 自分(制作)の別のしおり(#5)と同じ台帳を使っているが、
 *   文章は別内容のため重複なし(企画運営が確認済み)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea25-suitengu";

const ITIN_ID = "a54e45e0-4329-473b-abb3-b6cd6aca7327";
const DAY_ID = "b0f14177-b993-46bf-b6ae-2e94c491cb48";
const SUITENGU_SPOT_ID = "2c95855c-6f8c-4c37-af56-6047f441d6ae";
const ISHIBASHI_SPOT_ID = "321e19e9-bc51-49f0-a86c-9c80afd9162c";
const TANUSHIMARU_SPOT_ID = "4d412ea4-9ec9-4b5d-aee4-9815d2f64363";
const WINERY_SPOT_ID = "a857e6a8-ada1-4e01-a682-c12626cbff9a";

const NEW_DESCRIPTION =
  "全国水天宮の総本宮から、ブリヂストン創業者ゆかりの石橋文化センター、筑後国一の宮・高良大社、河童伝説が伝わる田主丸のかっぱ駅と巨峰ワイナリーまで、久留米市の歴史と物語をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。";

const KOURA_MEMO =
  "耳納連山の最西端、高良山の中腹に鎮座する、筑後国一の宮です。履中天皇元年(400)の創建と伝わり、祭神は高良玉垂命とされています。現在の本殿・幣殿・拝殿は、万治3年(1660)、久留米藩3代藩主・有馬頼利の建立で、江戸初期の権現造としては九州最大規模とされ、国の重要文化財に指定されています。境内の山中には、国の天然記念物に指定された孟宗金明竹林もあります。山頂からは筑後平野を一望できます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const MIILUNCH_MEMO = "高良大社の参道のふもとにあたるこのあたりには、地元で親しまれる食堂や飲食店が点在しています。好みの店で昼食をとりましょう。";

async function main() {
  const suitengu = await prisma.spot.findUnique({ where: { id: SUITENGU_SPOT_ID } });
  const ishibashi = await prisma.spot.findUnique({ where: { id: ISHIBASHI_SPOT_ID } });
  const tanushimaru = await prisma.spot.findUnique({ where: { id: TANUSHIMARU_SPOT_ID } });
  const winery = await prisma.spot.findUnique({ where: { id: WINERY_SPOT_ID } });
  if (!suitengu || !ishibashi?.memo || !tanushimaru || !winery?.memo) throw new Error("想定と違います");

  const newIshibashiMemo = ishibashi.memo.replace(
    "入園料・観覧料や開園時間は季節や展示により変わることがあるので、公式サイトで確かめてください。",
    "開園時間は季節や展示により変わることがあるので、公式サイトで確かめましょう。"
  );
  const newWineryMemo = winery.memo.replace(
    "営業日・営業時間は季節により変わるので、お出かけ前に公式サイトで確かめてください。",
    "営業日・営業時間は季節により変わるので、お出かけ前に公式サイトで確かめましょう。"
  );
  if (newIshibashiMemo === ishibashi.memo || newWineryMemo === winery.memo) throw new Error("置換対象が見つかりません");

  const kouraDup = await prisma.placeMaster.findFirst({ where: { name: "高良大社" } });
  const lunchDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "御井町周辺" } } });
  if (kouraDup || lunchDup) throw new Error("台帳が既に存在します(想定外)");

  console.log("[確認OK] 説明文を直す(高良大社を追加)");
  console.log("[確認OK] 石橋文化センターのメモからお金の話・「ください」を削除");
  console.log("[確認OK] 巨峰ワイナリーのメモの「ください」を直す");
  console.log("[確認OK] 水天宮の開始時刻を9:00→9:30に、以降をすべてずらす");
  console.log("[確認OK] 御井町周辺（昼食）・高良大社を追加して16:30まで延ばす");

  const kouraPhoto = await uploadCommonsFile("高良大社拝殿.JPG", "高良大社", BLOB_PREFIX);
  if (!kouraPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(高良大社)");
  console.log("取得:", kouraPhoto.url, kouraPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: ISHIBASHI_SPOT_ID }, data: { memo: newIshibashiMemo } });
  await prisma.spot.update({ where: { id: WINERY_SPOT_ID }, data: { memo: newWineryMemo } });

  // 水天宮: 9:00→9:30
  await prisma.spot.update({ where: { id: SUITENGU_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 9, 30)) } });
  // 石橋文化センター: 10:05→10:35(水天宮9:30+50+15分移動)
  await prisma.spot.update({ where: { id: ISHIBASHI_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 35)) } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: suitengu.placeMasterId! } }))!.prefectureAreaId;

  // 田主丸・ワイナリーをいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: TANUSHIMARU_SPOT_ID }, data: { orderNo: 98 } });
  await prisma.spot.update({ where: { id: WINERY_SPOT_ID }, data: { orderNo: 99 } });

  // 御井町周辺（昼食）: orderNo3、石橋文化センター(10:35+100=12:15)から10分で12:25着、50分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "御井町周辺", address: "福岡県久留米市御井町", lat: 33.299603, lng: 130.54628,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 3, name: "御井町周辺（昼食）",
      address: "福岡県久留米市御井町", lat: 33.299603, lng: 130.54628,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 25)), memo: MIILUNCH_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });

  // 高良大社: orderNo4、昼食(12:25+50=13:15)から5分で13:20着、45分滞在
  const kouraPlace = await prisma.placeMaster.create({
    data: {
      name: "高良大社", address: "福岡県久留米市御井町1", lat: 33.3013697, lng: 130.5645179,
      prefectureAreaId, category: "shrine", isWideArea: false, isMemorial: false,
      photoUrl: kouraPhoto.url, photoAuthor: kouraPhoto.credit.author ?? null,
      photoLicense: kouraPhoto.credit.license ?? null, photoLicenseUrl: kouraPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: kouraPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const kouraSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: kouraPlace.id, orderNo: 4, name: "高良大社",
      address: "福岡県久留米市御井町1", lat: 33.3013697, lng: 130.5645179,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 20)), memo: KOURA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kouraSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: kouraSpot.id, url: kouraPhoto.url, caption: "高良大社",
      sourceUrl: kouraPhoto.credit.sourceUrl ?? null, author: kouraPhoto.credit.author ?? null,
      license: kouraPhoto.credit.license ?? null, licenseUrl: kouraPhoto.credit.licenseUrl ?? null,
    },
  });

  // 田主丸駅とかっぱの町並み: orderNo5、高良大社(13:20+45=14:05)から28分で14:33着
  const tanushimaruTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: TANUSHIMARU_SPOT_ID, orderNo: 1 } });
  await prisma.spot.update({
    where: { id: TANUSHIMARU_SPOT_ID },
    data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 33)) },
  });
  if (tanushimaruTransit) await prisma.spotTransitLeg.update({ where: { id: tanushimaruTransit.id }, data: { transitDurationMin: 28 } });

  // 巨峰ワイナリー: orderNo6、田主丸(14:33+35=15:08)から10分で15:18着、72分滞在(16:30終了)
  const wineryTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: WINERY_SPOT_ID, orderNo: 1 } });
  await prisma.spot.update({
    where: { id: WINERY_SPOT_ID },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 18)), stayDurationMin: 72 },
  });
  if (wineryTransit) await prisma.spotTransitLeg.update({ where: { id: wineryTransit.id }, data: { transitDurationMin: 10 } });

  console.log("  COMMITTED: 新しい地域#25 水天宮と石橋文化センター");
}
main().finally(() => prisma.$disconnect());
