/**
 * #2の直しの続き(orderNoの一意制約エラーで中断した分)。江川邸を先にorderNo 4へ、
 * その後蔵屋鳴沢（昼食）をorderNo 3で追加し、続けて蛭ヶ島公園・伊豆パノラマパークを
 * 追加する(蔵屋鳴沢の台帳は作成済みのものを再利用)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-02-izunagaoka-fix2";
const DAY_ID = "9a54cd19-ae6e-4811-9c87-772ca94d9b2c";
const EGAWATEI_SPOT_ID = "09e4dc85-b84f-465b-9cb0-eab50181d024";
const KURAYA_PLACE_ID = "2338052e-19ca-4617-a990-4003b21e36a4";

const KURAYA_MEMO =
  "韮山反射炉に隣接する複合施設で、売店やレストランがあります。地元で摘まれた茶葉を使った商品なども扱っています。ここで昼食をとりましょう。";
const HIRUGASHIMA_MEMO =
  "源頼朝が、平治の乱のあと配流されていた地と伝わる公園です。江戸時代の学者・秋山富南が伊豆国の地誌『豆州志稿』をまとめる中でこの場所を配流地と見定め、寛政2年(1790)には碑も建てられました。現在は、頼朝と妻・北条政子の像が置かれています。発掘調査では平安時代末期の遺構は見つかっておらず、伝承地とされています。";
const PANORAMA_MEMO =
  "葛城山の山頂までロープウェイで結び、山頂からは駿河湾や富士山を見渡す眺めが広がります。冬は運行時間が短くなるため、訪れる前に公式サイトで確かめましょう。";

async function main() {
  const egawatei = await prisma.spot.findUnique({ where: { id: EGAWATEI_SPOT_ID } });
  const kurayaPlace = await prisma.placeMaster.findUnique({ where: { id: KURAYA_PLACE_ID } });
  if (!egawatei || !kurayaPlace) throw new Error("想定と違います");
  console.log("[確認OK] 江川邸をorderNo 4へ、蔵屋鳴沢（昼食）をorderNo 3で追加");
  console.log("[確認OK] 蛭ヶ島公園(orderNo 5)・伊豆パノラマパーク(orderNo 6)を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.spot.update({ where: { id: EGAWATEI_SPOT_ID }, data: { orderNo: 99 } });

  const kurayaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: KURAYA_PLACE_ID, orderNo: 3, name: "蔵屋鳴沢（昼食）",
      address: "静岡県伊豆の国市中272-1", lat: 35.039082, lng: 138.961945,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 10)), memo: KURAYA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kurayaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  await prisma.spot.update({ where: { id: EGAWATEI_SPOT_ID }, data: { orderNo: 4 } });

  const hirugashimaResult = await uploadCommonsFile("Hirugakojima.jpg", "蛭ヶ島公園", BLOB_PREFIX);
  if (!hirugashimaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(蛭ヶ島公園)");
  console.log("取得:", hirugashimaResult.url, hirugashimaResult.credit);
  const hirugashimaPlace = await prisma.placeMaster.create({
    data: {
      name: "蛭ヶ島公園", address: "静岡県伊豆の国市四日町17-1", lat: 35.0516575, lng: 138.9516024,
      prefectureAreaId: kurayaPlace.prefectureAreaId, category: "other", isWideArea: false, isMemorial: false,
      photoUrl: hirugashimaResult.url, photoAuthor: hirugashimaResult.credit.author ?? null,
      photoLicense: hirugashimaResult.credit.license ?? null, photoLicenseUrl: hirugashimaResult.credit.licenseUrl ?? null,
      photoSourceUrl: hirugashimaResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const hirugashimaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: hirugashimaPlace.id, orderNo: 5, name: "蛭ヶ島公園",
      address: "静岡県伊豆の国市四日町17-1", lat: 35.0516575, lng: 138.9516024,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 13)), memo: HIRUGASHIMA_MEMO, stayDurationMin: 25,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hirugashimaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 8 } });
  await prisma.photo.create({
    data: {
      spotId: hirugashimaSpot.id, url: hirugashimaResult.url, caption: "蛭ヶ島公園",
      sourceUrl: hirugashimaResult.credit.sourceUrl ?? null, author: hirugashimaResult.credit.author ?? null,
      license: hirugashimaResult.credit.license ?? null, licenseUrl: hirugashimaResult.credit.licenseUrl ?? null,
    },
  });

  const panoramaResult = await uploadCommonsFile("Katsuragiyama-Panorama-Park.JPG", "伊豆パノラマパーク", BLOB_PREFIX);
  if (!panoramaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(伊豆パノラマパーク)");
  console.log("取得:", panoramaResult.url, panoramaResult.credit);
  const panoramaPlace = await prisma.placeMaster.create({
    data: {
      name: "伊豆パノラマパーク", address: "静岡県伊豆の国市長岡260-1", lat: 35.031592, lng: 138.9320366,
      prefectureAreaId: kurayaPlace.prefectureAreaId, category: "view", isWideArea: false, isMemorial: false,
      websiteUrl: "https://www.panoramapark.co.jp/",
      photoUrl: panoramaResult.url, photoAuthor: panoramaResult.credit.author ?? null,
      photoLicense: panoramaResult.credit.license ?? null, photoLicenseUrl: panoramaResult.credit.licenseUrl ?? null,
      photoSourceUrl: panoramaResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const panoramaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: panoramaPlace.id, orderNo: 6, name: "伊豆パノラマパーク",
      address: "静岡県伊豆の国市長岡260-1", lat: 35.031592, lng: 138.9320366,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 50)), memo: PANORAMA_MEMO, stayDurationMin: 100,
      websiteUrl: "https://www.panoramapark.co.jp/",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: panoramaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 12 } });
  await prisma.photo.create({
    data: {
      spotId: panoramaSpot.id, url: panoramaResult.url, caption: "伊豆パノラマパーク",
      sourceUrl: panoramaResult.credit.sourceUrl ?? null, author: panoramaResult.credit.author ?? null,
      license: panoramaResult.credit.license ?? null, licenseUrl: panoramaResult.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
