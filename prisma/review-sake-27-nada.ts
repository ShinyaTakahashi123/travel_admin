/**
 * 承認待ちしおりの見直し・酒蔵めぐり#27(87e30105、灘五郷の酒蔵めぐりと御影公会堂)。
 * 既に5か所あり(9:30-14:40)、4か所以上・9:30開始の決まりは満たしていたため、
 * 新たに2か所(神戸酒心館・沢の鶴資料館)を追加して16:30まで延ばす。
 * 既存5スポットの文面はもともとお金の話・「ください」がなく問題なし。
 * 説明文の「有料の場合があり」というお金の話と「ください」のみ直す。
 *
 * - 神戸酒心館(福寿): 御影塚町1-8-17、蔵元ショップ「東明蔵」は10:00-18:30で
 *   試飲・購入は予約不要(蔵見学のみ予約制)と複数の観光情報サイトで確認
 * - 沢の鶴資料館: 灘区大石南町1-29-1、開館10:00-16:00・水曜休館。昭和53年(1978)
 *   開館、阪神・淡路大震災で全壊後、旧来の木材で再建し全国初の木造免震システムを
 *   採用。兵庫県重要有形民俗文化財の酒造り道具181種2,884点を展示(神戸新聞PR
 *   TIMES配信記事等で確認)
 * - 白鶴酒造資料館(既存・最後の見学先)は、ルートを西へ延ばした沢の鶴の後に
 *   続く形にし、「今日一日の締めくくりに」という既存の文言はそのまま活かせる
 *   順番にした(白鶴は引き続き最後のスポット)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake27-nada";

const ITIN_ID = "87e30105-e571-44bf-96b9-75a6e3e74221";
const DAY_ID = "41a09ca6-25b0-42b9-9ffd-c4211d368bf7";
const SAKURAMASAMUNE_SPOT_ID = "ac66ae6c-3b94-4cc8-a35b-606b15d730fe";
const HAKUTSURU_SPOT_ID = "97e7c0de-6283-4e06-9d1c-928eab7fcc4f";

const NEW_DESCRIPTION =
  "阪神魚崎駅から御影・住吉へ、菊正宗・浜福鶴・神戸酒心館・櫻正宗・沢の鶴・白鶴の酒蔵が集まる灘五郷を、電車と徒歩でめぐる日帰りプランです。灘五郷ゆかりの御影公会堂もあわせて訪ねます。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const SHUSHINKAN_MEMO =
  "灘五郷の一つ、御影郷にある「福寿」の醸造元です。蔵元ショップ「東明蔵」では、できたての日本酒の試飲や購入ができ、蔵の雰囲気を生かした料亭も併設されています。酒蔵の内部見学は予約制です。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。";

const SAWANOTSURU_MEMO =
  "江戸時代末期に建てられた酒蔵を活用した資料館で、昭和53年(1978)に開館しました。平成7年(1995)の阪神・淡路大震災で全壊しましたが、文化財指定を維持するため、もとの木材を使って再建され、木造建築物としては全国で初めてとなる免震システムが採用されています。兵庫県の重要有形民俗文化財に指定された、灘の酒造りの道具181種2,884点を、工程に沿って展示しているほか、酒を運んだ樽廻船の模型なども見られます。";

async function main() {
  const sakuramasamune = await prisma.spot.findUnique({ where: { id: SAKURAMASAMUNE_SPOT_ID } });
  const hakutsuru = await prisma.spot.findUnique({ where: { id: HAKUTSURU_SPOT_ID } });
  if (!sakuramasamune || !hakutsuru) throw new Error("想定と違います");

  const dupNames = ["神戸酒心館", "沢の鶴"];
  for (const n of dupNames) {
    const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: n } } });
    if (dup) throw new Error("台帳が既に存在します(想定外): " + n);
  }

  console.log("[確認OK] 説明文を直す(お金の話・「ください」を削除、新スポットを追加)");
  console.log("[確認OK] 神戸酒心館・沢の鶴資料館を追加して16:30まで延ばす(白鶴は引き続き最後)");

  const shushinkanPhoto = await uploadCommonsFile("Shushinkan gate.JPG", "神戸酒心館", BLOB_PREFIX);
  if (!shushinkanPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(神戸酒心館)");
  console.log("取得:", shushinkanPhoto.url, shushinkanPhoto.credit);

  const sawanotsuruPhoto = await uploadCommonsFile("Sawanotsuru Sake Museum 2022-03-05.jpg", "沢の鶴資料館", BLOB_PREFIX);
  if (!sawanotsuruPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(沢の鶴資料館)");
  console.log("取得:", sawanotsuruPhoto.url, sawanotsuruPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: sakuramasamune.placeMasterId! } }))!.prefectureAreaId;

  // 白鶴をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: HAKUTSURU_SPOT_ID }, data: { orderNo: 90 } });

  // 神戸酒心館: orderNo5、櫻正宗(12:10+70=13:20)から5分で13:25着、60分滞在
  const shushinkanPlace = await prisma.placeMaster.create({
    data: {
      name: "神戸酒心館", address: "兵庫県神戸市東灘区御影塚町1-8-17", lat: 34.710304, lng: 135.248322,
      prefectureAreaId, category: "sake_brewery", isWideArea: false, isMemorial: false,
      photoUrl: shushinkanPhoto.url, photoAuthor: shushinkanPhoto.credit.author ?? null,
      photoLicense: shushinkanPhoto.credit.license ?? null, photoLicenseUrl: shushinkanPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: shushinkanPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const shushinkanSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: shushinkanPlace.id, orderNo: 5, name: "神戸酒心館",
      address: "兵庫県神戸市東灘区御影塚町1-8-17", lat: 34.710304, lng: 135.248322,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 25)), memo: SHUSHINKAN_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: shushinkanSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: shushinkanSpot.id, url: shushinkanPhoto.url, caption: "神戸酒心館",
      sourceUrl: shushinkanPhoto.credit.sourceUrl ?? null, author: shushinkanPhoto.credit.author ?? null,
      license: shushinkanPhoto.credit.license ?? null, licenseUrl: shushinkanPhoto.credit.licenseUrl ?? null,
    },
  });

  // 沢の鶴資料館: orderNo6、神戸酒心館(13:25+60=14:25)から10分で14:35着、35分滞在
  const sawanotsuruPlace = await prisma.placeMaster.create({
    data: {
      name: "沢の鶴資料館", address: "兵庫県神戸市灘区大石南町1-29-1", lat: 34.704006, lng: 135.232788,
      prefectureAreaId, category: "sake_brewery", isWideArea: false, isMemorial: false,
      photoUrl: sawanotsuruPhoto.url, photoAuthor: sawanotsuruPhoto.credit.author ?? null,
      photoLicense: sawanotsuruPhoto.credit.license ?? null, photoLicenseUrl: sawanotsuruPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: sawanotsuruPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const sawanotsuruSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: sawanotsuruPlace.id, orderNo: 6, name: "沢の鶴資料館",
      address: "兵庫県神戸市灘区大石南町1-29-1", lat: 34.704006, lng: 135.232788,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 35)), memo: SAWANOTSURU_MEMO, stayDurationMin: 35,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sawanotsuruSpot.id, orderNo: 1, transitMode: "train", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: sawanotsuruSpot.id, url: sawanotsuruPhoto.url, caption: "沢の鶴資料館",
      sourceUrl: sawanotsuruPhoto.credit.sourceUrl ?? null, author: sawanotsuruPhoto.credit.author ?? null,
      license: sawanotsuruPhoto.credit.license ?? null, licenseUrl: sawanotsuruPhoto.credit.licenseUrl ?? null,
    },
  });

  // 白鶴酒造資料館: orderNo7、沢の鶴(14:35+35=15:10)から15分で15:25着、65分滞在(16:30終了、既存の移動データを更新)
  const hakutsuruTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: HAKUTSURU_SPOT_ID, orderNo: 1 } });
  if (!hakutsuruTransit) throw new Error("白鶴の移動データが見つかりません");
  await prisma.spot.update({
    where: { id: HAKUTSURU_SPOT_ID },
    data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 25)), stayDurationMin: 65 },
  });
  await prisma.spotTransitLeg.update({ where: { id: hakutsuruTransit.id }, data: { transitMode: "train", transitDurationMin: 15 } });

  console.log("  COMMITTED: 酒蔵めぐり#27 灘五郷の酒蔵めぐりと御影公会堂");
}
main().finally(() => prisma.$disconnect());
