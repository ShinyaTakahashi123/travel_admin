/**
 * 承認待ち36本の見直し・#3(57126c5e、館山でいちご狩りと里見氏ゆかりの館山城)。
 * #1・#2で学んだ決まり(お金の話をしない・「〜しましょう」調・出典サイト名や会社名を
 * 本文に出さない・昼食をスポットとして分ける・ぼかしは同じ文に・座標は実点)を
 * 最初から反映する。あわせて、既存データの時刻の矛盾(館山城の到着時刻が移動時間と
 * 合っていない、那古寺の到着時刻が移動時間と逆算で合わない)も直す。
 *
 * - 渚の駅たてやま（昼食）: 渚の博物館・海辺の広場・さかなクンギャラリーなどからなる
 *   館山市の複合施設(https://tateyamacity.com/en/?p=2558)
 * - 大福寺（崖観音）: 伝承では養老元年(717)行基の開山とされるが、承応2年(1653)の
 *   火災で古記録を失っており、現存する磨崖仏は平安時代中ごろと推測される
 *   (https://tabi-mag.jp/ch0058/)
 * - 安房神社: 安房国の一宮とされる神社(https://maruchiba.jp/spot/detail_10587.html)
 * - 洲崎灯台: 大正8年(1919)初点灯、コンクリート造り初期型として国の登録有形文化財
 *   (https://tabi-mag.jp/ch0257/)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-03-tateyama";

const ITIN_ID = "57126c5e-52ef-4b79-b3ff-1216c57bb7d8";
const DAY_ID = "779403af-5a18-46ae-8da0-6421b6b3bcdf";
const ICHIGO_SPOT_ID = "7aa28c11-019e-44bb-a001-6c8e34e470b4";
const CASTLE_SPOT_ID = "a7868fe3-196b-4d4a-b131-40334edc93d0";
const NAGOJI_SPOT_ID = "66011aad-e40c-412d-8034-60723dc1d1dd";
const NAGOJI_TRANSIT_ID = "60c0736c-2a27-48f5-ab22-6c8b89db0630";

const NEW_DESCRIPTION =
  "いくつかの農園が集まる観光いちご園でいちご狩りを楽しんだあと、戦国大名・里見氏の居城跡に建つ館山城(八犬伝博物館)をめぐります。渚の駅たてやまで昼食をとり、坂東三十三観音の結願寺・那古寺、崖の中腹に建つ大福寺(崖観音)、安房国の一宮・安房神社、房総半島最西端の洲崎灯台をめぐる日帰りプランです。";

const ICHIGO_MEMO =
  "いくつかのいちご農園が集まった、千葉県内でも大きないちご狩りセンターです。園によって「紅ほっぺ」「あきひめ」など栽培する品種が異なります。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、この観光農園の中だけにしましょう。観光農園以外の畑には入らないようにしましょう。";

const NAGISA_MEMO =
  "渚の博物館や海辺の広場、さかなクンギャラリーなどからなる館山市の複合施設です。海を望むレストランや、地元の産品を扱う市場もあり、ここで昼食をとりましょう。";

const GAKEKANNON_MEMO =
  "養老元年(717)に行基が東国を巡った際、地元の漁師の海の安全と豊漁を祈って岩肌に十一面観世音菩薩を彫ったのが始まりと伝わる、崖の中腹に建つ舞台造りのお堂です。地元では「崖観音」の名で親しまれています。江戸時代の承応2年(1653)の火災で古い記録を失っており、現存する磨崖仏は平安時代中ごろのものと推測されています。お堂からは館山湾を見渡すことができます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const AWAJINJA_MEMO =
  "安房国の一宮とされる神社で、忌部氏の祖神・天太玉命を主祭神として祀ります。境内には、天富命を祀る下の宮もあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const SUNOSAKI_MEMO =
  "大正8年(1919)に初めて灯台がともった、房総半島最西端の洲崎に立つ灯台です。コンクリート造りの灯台としては初期のもので、国の登録有形文化財に指定されています。東京湾の入口を見渡す眺めが広がります。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { description: true } });
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const castle = await prisma.spot.findUnique({ where: { id: CASTLE_SPOT_ID }, include: { photos: true } });
  const nagoji = await prisma.spot.findUnique({ where: { id: NAGOJI_SPOT_ID } });
  if (!itin || !ichigo || !castle || !nagoji) throw new Error("想定と違います");

  for (const name of ["渚の駅たてやま", "大福寺", "安房神社", "洲崎灯台"]) {
    const existing = await prisma.placeMaster.findFirst({ where: { name: { contains: name } } });
    if (existing) throw new Error(`台帳が既に存在します(想定外): ${name}`);
  }

  console.log("[確認OK] 説明文・いちごの森のメモを直す");
  console.log("[確認OK] 館山城の到着時刻(11:00→10:50)を直す");
  console.log("[確認OK] 渚の駅たてやま（昼食）・那古寺(時刻直し)・大福寺（崖観音）・安房神社・洲崎灯台を追加して16:30まで延ばす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { memo: ICHIGO_MEMO } });
  await prisma.spot.update({ where: { id: CASTLE_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 50)) } });
  // orderNoの衝突を避けるため、那古寺を一時的なorderNoへ
  await prisma.spot.update({ where: { id: NAGOJI_SPOT_ID }, data: { orderNo: 99 } });

  // 渚の駅たてやま（昼食）: orderNo 3、館山城(10:50+60=11:50)から5分で11:55着、60分滞在
  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: castle.placeMasterId! } }))!.prefectureAreaId;
  const nagisaResult = await uploadCommonsFile("Nagisanoeki Tateyama.JPG", "渚の駅たてやま", BLOB_PREFIX);
  if (!nagisaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(渚の駅たてやま)");
  console.log("取得:", nagisaResult.url, nagisaResult.credit);
  const nagisaPlace = await prisma.placeMaster.create({
    data: {
      name: "渚の駅たてやま", address: "千葉県館山市館山1564-1", lat: 34.988209, lng: 139.853256,
      prefectureAreaId, category: "gourmet", isWideArea: false, isMemorial: false,
      websiteUrl: "https://tateyamacity.com/en/?p=2558",
      photoUrl: nagisaResult.url, photoAuthor: nagisaResult.credit.author ?? null,
      photoLicense: nagisaResult.credit.license ?? null, photoLicenseUrl: nagisaResult.credit.licenseUrl ?? null,
      photoSourceUrl: nagisaResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const nagisaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: nagisaPlace.id, orderNo: 3, name: "渚の駅たてやま（昼食）",
      address: "千葉県館山市館山1564-1", lat: 34.988209, lng: 139.853256,
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 55)), memo: NAGISA_MEMO, stayDurationMin: 60,
      websiteUrl: "https://tateyamacity.com/en/?p=2558",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: nagisaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: nagisaSpot.id, url: nagisaResult.url, caption: "渚の駅たてやま",
      sourceUrl: nagisaResult.credit.sourceUrl ?? null, author: nagisaResult.credit.author ?? null,
      license: nagisaResult.credit.license ?? null, licenseUrl: nagisaResult.credit.licenseUrl ?? null,
    },
  });

  // 那古寺をorderNo 4に、時刻・移動時間を直す(渚の駅11:55+60=12:55から10分で13:05着)
  await prisma.spot.update({
    where: { id: NAGOJI_SPOT_ID },
    data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 5)) },
  });
  await prisma.spotTransitLeg.update({ where: { id: NAGOJI_TRANSIT_ID }, data: { transitDurationMin: 10 } });

  // 大福寺（崖観音）: orderNo 5、那古寺(13:05+45=13:50)から5分で13:55着、30分滞在
  const gakeResult = await uploadCommonsFile("Daifukuji (Tateyama).JPG", "大福寺", BLOB_PREFIX);
  if (!gakeResult) throw new Error("画像の取得・ライセンス確認に失敗しました(大福寺)");
  console.log("取得:", gakeResult.url, gakeResult.credit);
  const gakePlace = await prisma.placeMaster.create({
    data: {
      name: "大福寺", address: "千葉県館山市船形835", lat: 35.031361, lng: 139.839661,
      prefectureAreaId, category: "temple", isWideArea: false, isMemorial: false,
      photoUrl: gakeResult.url, photoAuthor: gakeResult.credit.author ?? null,
      photoLicense: gakeResult.credit.license ?? null, photoLicenseUrl: gakeResult.credit.licenseUrl ?? null,
      photoSourceUrl: gakeResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const gakeSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: gakePlace.id, orderNo: 5, name: "大福寺（崖観音）",
      address: "千葉県館山市船形835", lat: 35.031361, lng: 139.839661,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 55)), memo: GAKEKANNON_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: gakeSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: gakeSpot.id, url: gakeResult.url, caption: "大福寺（崖観音）",
      sourceUrl: gakeResult.credit.sourceUrl ?? null, author: gakeResult.credit.author ?? null,
      license: gakeResult.credit.license ?? null, licenseUrl: gakeResult.credit.licenseUrl ?? null,
    },
  });

  // 安房神社: orderNo 6、大福寺(13:55+30=14:25)から25分で14:50着、40分滞在
  const awaResult = await uploadCommonsFile("Awa-jinja, haiden.JPG", "安房神社", BLOB_PREFIX);
  if (!awaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(安房神社)");
  console.log("取得:", awaResult.url, awaResult.credit);
  const awaPlace = await prisma.placeMaster.create({
    data: {
      name: "安房神社", address: "千葉県館山市大神宮589", lat: 34.9249561, lng: 139.8372045,
      prefectureAreaId, category: "shrine", isWideArea: false, isMemorial: false,
      photoUrl: awaResult.url, photoAuthor: awaResult.credit.author ?? null,
      photoLicense: awaResult.credit.license ?? null, photoLicenseUrl: awaResult.credit.licenseUrl ?? null,
      photoSourceUrl: awaResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const awaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: awaPlace.id, orderNo: 6, name: "安房神社",
      address: "千葉県館山市大神宮589", lat: 34.9249561, lng: 139.8372045,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 50)), memo: AWAJINJA_MEMO, stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: awaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 25 } });
  await prisma.photo.create({
    data: {
      spotId: awaSpot.id, url: awaResult.url, caption: "安房神社",
      sourceUrl: awaResult.credit.sourceUrl ?? null, author: awaResult.credit.author ?? null,
      license: awaResult.credit.license ?? null, licenseUrl: awaResult.credit.licenseUrl ?? null,
    },
  });

  // 洲崎灯台: orderNo 7、安房神社(14:50+40=15:30)から20分で15:50着、40分滞在(16:30終了)
  const sunosakiResult = await uploadCommonsFile(
    "Sunosaki Lighthouse (Tateyama City, Chiba Prefecture) 2023b.jpg",
    "洲崎灯台",
    BLOB_PREFIX
  );
  if (!sunosakiResult) throw new Error("画像の取得・ライセンス確認に失敗しました(洲崎灯台)");
  console.log("取得:", sunosakiResult.url, sunosakiResult.credit);
  const sunosakiPlace = await prisma.placeMaster.create({
    data: {
      name: "洲崎灯台", address: "千葉県館山市洲崎1043", lat: 34.977871, lng: 139.755356,
      prefectureAreaId, category: "view", isWideArea: false, isMemorial: false,
      photoUrl: sunosakiResult.url, photoAuthor: sunosakiResult.credit.author ?? null,
      photoLicense: sunosakiResult.credit.license ?? null, photoLicenseUrl: sunosakiResult.credit.licenseUrl ?? null,
      photoSourceUrl: sunosakiResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const sunosakiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: sunosakiPlace.id, orderNo: 7, name: "洲崎灯台",
      address: "千葉県館山市洲崎1043", lat: 34.977871, lng: 139.755356,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)), memo: SUNOSAKI_MEMO, stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sunosakiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 20 } });
  await prisma.photo.create({
    data: {
      spotId: sunosakiSpot.id, url: sunosakiResult.url, caption: "洲崎灯台",
      sourceUrl: sunosakiResult.credit.sourceUrl ?? null, author: sunosakiResult.credit.author ?? null,
      license: sunosakiResult.credit.license ?? null, licenseUrl: sunosakiResult.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED: #3 館山でいちご狩りと里見氏ゆかりの館山城");
}
main().finally(() => prisma.$disconnect());
