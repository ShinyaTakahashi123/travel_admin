/**
 * fix2の続き(orderNoの一意制約エラーで中断した分)。南ヶ丘牧場を先にorderNo 6へ、
 * その後ステンドグラス美術館をorderNo 5で追加する(台帳・写真は作成済みのものを再利用)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const DAY_ID = "468695c0-fd4b-4c20-af9c-208df69e6178";
const SGM_PLACE_ID = "a5c354fe-704e-4912-97d4-f1dc57a33cee";
const SGM_PHOTO_URL = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/pending36-01-nasu-fix2/%25E9%2582%25A3%25E9%25A0%2588%25E3%2582%25B9%25E3%2583%2586%25E3%2583%25B3%25E3%2583%2589%25E3%2582%25B0%25E3%2583%25A9%25E3%2582%25B9%25E7%25BE%258E%25E8%25A1%2593%25E9%25A4%25A8-9Cw3oTrQKVtFk5OPQuB2qSurH7Shxv.jpg";
const SGM_CREDIT = {
  sourceUrl: "https://commons.wikimedia.org/wiki/File:190725_Nasu_Stained_Glass_Museum_Nasu_Tochigi_pref_Japan02s3.jpg",
  author: "663highland",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
};
const SGM_MEMO =
  "カラフルなステンドグラスのチャペルや、アンティークのステンドグラス作品を展示する屋内の美術館です。ヨーロッパの教会を思わせる建物や庭園も見どころです。休館日があるため、訪れる前に公式サイトで確かめましょう。";
const MINAMIGAOKA_MEMO =
  "昭和23年(1948)創業の牧場です。牛や羊、ポニーなどの動物とふれあえるほか、バター作りやアイスクリーム作りの体験もできます。体験の内容や予約の要否は、公式サイトで確かめましょう。売店では、牧場で作ったチーズやソフトクリームも楽しめます。旅の最後に、ゆっくりと那須の牧場風景を楽しみましょう。";

async function main() {
  const minamigaoka = await prisma.spot.findFirst({ where: { name: "南ヶ丘牧場", dayId: DAY_ID } });
  const sgmPlace = await prisma.placeMaster.findUnique({ where: { id: SGM_PLACE_ID } });
  if (!minamigaoka || !sgmPlace) throw new Error("想定と違います");
  console.log("[確認OK] 南ヶ丘牧場をorderNo 6・15:40開始・50分滞在に変更");
  console.log("[確認OK] 那須ステンドグラス美術館をorderNo 5・14:30開始・60分滞在で追加(台帳・写真は再利用)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // 一時的にorderNoの衝突を避けるため、先に南ヶ丘牧場を一時的なorderNo(99)へ
  await prisma.spot.update({ where: { id: minamigaoka.id }, data: { orderNo: 99 } });

  const sgmSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID,
      placeMasterId: SGM_PLACE_ID,
      orderNo: 5,
      name: "那須ステンドグラス美術館",
      address: "栃木県那須郡那須町高久丙1790",
      lat: 37.065746,
      lng: 140.024429,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)),
      memo: SGM_MEMO,
      stayDurationMin: 60,
      websiteUrl: "https://sgm-nasu.com/",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sgmSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });
  await prisma.photo.create({
    data: {
      spotId: sgmSpot.id, url: SGM_PHOTO_URL, caption: "那須ステンドグラス美術館",
      sourceUrl: SGM_CREDIT.sourceUrl, author: SGM_CREDIT.author, license: SGM_CREDIT.license, licenseUrl: SGM_CREDIT.licenseUrl,
    },
  });

  await prisma.spot.update({
    where: { id: minamigaoka.id },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)), stayDurationMin: 50, memo: MINAMIGAOKA_MEMO },
  });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: minamigaoka.id }, data: { transitDurationMin: 10 } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
