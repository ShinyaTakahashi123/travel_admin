/**
 * 承認待ち36本の見直し・#2(0ba3c742、伊豆長岡でいちご狩りと世界遺産・韮山反射炉)。
 * #1で学んだ決まり(お金の話をしない・「〜しましょう」調・出典サイト名や会社名を
 * 本文に出さない・昼食をスポットとして分ける・滞在を延ばしすぎない・座標は実点)を
 * 最初から反映する。
 *
 * - 蔵屋鳴沢（昼食）: 韮山反射炉に隣接する複合施設(住所は2009年のラジオ番組の記録と
 *   GSIの番地の点で確認。現在の正確な住所・営業時間は公式サイトが見つからなかった
 *   ため本文には書かない)
 * - 蛭ヶ島公園: 源頼朝の配流地と伝わる公園(秋山富南による比定、発掘調査では平安期の
 *   遺構は未確認。tabi-mag.jp/sz332/・tabi-mag.jp/day0311/で確認)
 * - 伊豆パノラマパーク: 公式サイト(https://www.panoramapark.co.jp/hours_fare/)で、
 *   ロープウェイの冬季(10/16〜2/15)営業時間9:00〜17:00・上り最終16:30を確認。
 *   到着予定14:50なので余裕あり
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-02-izunagaoka";

const ITIN_ID = "0ba3c742-ad3f-41e9-b5a9-164713022713";
const DAY_ID = "9a54cd19-ae6e-4811-9c87-772ca94d9b2c";
const ICHIGO_SPOT_ID = "5ad5cb34-3a0f-45f0-8a9e-e60b15782e20";
const HANSHARO_SPOT_ID = "a3ec4c91-70e9-492c-9757-00394b97c78f";
const EGAWATEI_SPOT_ID = "09e4dc85-b84f-465b-9cb0-eab50181d024";
const EGAWATEI_TRANSIT_ID = "9220cf75-1999-4f03-9a62-920852b88ad1";

const NEW_DESCRIPTION =
  "伊豆長岡の観光いちご園でいちご狩りを楽しんだあと、世界遺産「明治日本の産業革命遺産」の一つ・韮山反射炉と、それを築いた江川家の屋敷・江川邸をめぐります。午後は源頼朝の配流地と伝わる蛭ヶ島公園を訪ね、伊豆パノラマパークのロープウェイで駿河湾や富士山の眺めを楽しむ日帰りプランです。";

const ICHIGO_MEMO =
  "静岡県で生まれたいちご「紅ほっぺ」を中心に、すべてのハウスが高設栽培で、車椅子でも利用しやすいとされています。車椅子での利用は、事前に公式の案内で確かめましょう。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、この観光農園の中だけにしましょう。観光農園以外の畑には入らないようにしましょう。";

const EGAWATEI_MEMO =
  "韮山反射炉を築いた韮山代官・江川家が、江戸時代を通じて代々暮らした屋敷です。36代当主・江川英龍(坦庵)は、韮山反射炉の建造や品川台場の築造のほか、日本で初めてパンを焼いたことでも知られる、幕末の多才な代官でした。主屋は昭和33年(1958)に、書院や蔵などは平成5年(1993)に、国の重要文化財に指定されています。公開の時間や休館日は季節によって変わるため、訪れる前に公式サイトで確かめましょう。";

const KURAYA_MEMO =
  "韮山反射炉に隣接する複合施設で、売店やレストランがあります。地元で摘まれた茶葉を使った商品なども扱っています。ここで昼食をとりましょう。";

const HIRUGASHIMA_MEMO =
  "源頼朝が、平治の乱のあと配流されていた地と伝わる公園です。江戸時代の学者・秋山富南が伊豆国の地誌『豆州志稿』をまとめる中でこの場所を配流地と見定め、寛政2年(1790)には碑も建てられました。現在は、頼朝と妻・北条政子の像が置かれています。発掘調査では平安時代末期の遺構は見つかっておらず、伝承地とされています。";

const PANORAMA_MEMO =
  "葛城山の山頂までロープウェイで結び、山頂からは駿河湾や富士山を見渡す眺めが広がります。冬は運行時間が短くなるため、訪れる前に公式サイトで確かめましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { description: true } });
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const hansharo = await prisma.spot.findUnique({ where: { id: HANSHARO_SPOT_ID } });
  const egawatei = await prisma.spot.findUnique({ where: { id: EGAWATEI_SPOT_ID } });
  if (!itin || !ichigo || !hansharo || !egawatei) throw new Error("想定と違います");

  const kuraya = await prisma.placeMaster.findFirst({ where: { name: "蔵屋鳴沢" } });
  const hirugashima = await prisma.placeMaster.findFirst({ where: { name: "蛭ヶ島公園" } });
  const panorama = await prisma.placeMaster.findFirst({ where: { name: "伊豆パノラマパーク" } });
  if (kuraya || hirugashima || panorama) throw new Error("新規に作る台帳が既に存在します(想定外)");

  console.log("[確認OK] 説明文・いちごの森・江川邸のメモを直す");
  console.log("[確認OK] 蔵屋鳴沢（昼食）・蛭ヶ島公園・伊豆パノラマパークを追加して16:30まで延ばす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { memo: ICHIGO_MEMO } });
  await prisma.spot.update({ where: { id: EGAWATEI_SPOT_ID }, data: { memo: EGAWATEI_MEMO, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 5)) } });
  await prisma.spotTransitLeg.update({ where: { id: EGAWATEI_TRANSIT_ID }, data: { transitDurationMin: 10 } });

  // 蔵屋鳴沢（昼食）: orderNo 3、韮山反射炉(10:55+70=12:05)から5分で12:10着、45分滞在
  const kurayaPlace = await prisma.placeMaster.create({
    data: {
      name: "蔵屋鳴沢",
      address: "静岡県伊豆の国市中272-1",
      lat: 35.039082,
      lng: 138.961945,
      prefectureAreaId: (await prisma.placeMaster.findUnique({ where: { id: hansharo.placeMasterId! } }))!.prefectureAreaId,
      category: "gourmet",
      isWideArea: false,
      isMemorial: false,
      source: "ai_collected",
      positionSource: "gsi",
      verifiedAt: new Date(),
    },
  });
  const kurayaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: kurayaPlace.id, orderNo: 3, name: "蔵屋鳴沢（昼食）",
      address: "静岡県伊豆の国市中272-1", lat: 35.039082, lng: 138.961945,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 10)), memo: KURAYA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kurayaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  // 江川邸をorderNo 4に
  await prisma.spot.update({ where: { id: EGAWATEI_SPOT_ID }, data: { orderNo: 4 } });

  // 蛭ヶ島公園: orderNo 5、江川邸(13:05+60=14:05)から8分で14:13着、25分滞在
  const hirugashimaResult = await uploadCommonsFile("Hirugakojima.jpg", "蛭ヶ島公園", BLOB_PREFIX);
  if (!hirugashimaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(蛭ヶ島公園)");
  console.log("取得:", hirugashimaResult.url, hirugashimaResult.credit);
  const hirugashimaPlace = await prisma.placeMaster.create({
    data: {
      name: "蛭ヶ島公園",
      address: "静岡県伊豆の国市四日町17-1",
      lat: 35.0516575,
      lng: 138.9516024,
      prefectureAreaId: kurayaPlace.prefectureAreaId,
      category: "other",
      isWideArea: false,
      isMemorial: false,
      photoUrl: hirugashimaResult.url,
      photoAuthor: hirugashimaResult.credit.author ?? null,
      photoLicense: hirugashimaResult.credit.license ?? null,
      photoLicenseUrl: hirugashimaResult.credit.licenseUrl ?? null,
      photoSourceUrl: hirugashimaResult.credit.sourceUrl ?? null,
      source: "ai_collected",
      positionSource: "osm",
      verifiedAt: new Date(),
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

  // 伊豆パノラマパーク: orderNo 6、蛭ヶ島公園(14:13+25=14:38)から12分で14:50着、100分滞在(16:30終了)
  const panoramaResult = await uploadCommonsFile("Katsuragiyama-Panorama-Park.JPG", "伊豆パノラマパーク", BLOB_PREFIX);
  if (!panoramaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(伊豆パノラマパーク)");
  console.log("取得:", panoramaResult.url, panoramaResult.credit);
  const panoramaPlace = await prisma.placeMaster.create({
    data: {
      name: "伊豆パノラマパーク",
      address: "静岡県伊豆の国市長岡260-1",
      lat: 35.031592,
      lng: 138.9320366,
      prefectureAreaId: kurayaPlace.prefectureAreaId,
      category: "view",
      isWideArea: false,
      isMemorial: false,
      websiteUrl: "https://www.panoramapark.co.jp/",
      photoUrl: panoramaResult.url,
      photoAuthor: panoramaResult.credit.author ?? null,
      photoLicense: panoramaResult.credit.license ?? null,
      photoLicenseUrl: panoramaResult.credit.licenseUrl ?? null,
      photoSourceUrl: panoramaResult.credit.sourceUrl ?? null,
      source: "ai_collected",
      positionSource: "osm",
      verifiedAt: new Date(),
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

  console.log("  COMMITTED: #2 伊豆長岡でいちご狩りと世界遺産・韮山反射炉");
}
main().finally(() => prisma.$disconnect());
