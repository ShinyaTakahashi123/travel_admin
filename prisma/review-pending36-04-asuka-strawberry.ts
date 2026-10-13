/**
 * 承認待ち36本の見直し・#4(14a5c98b、明日香村でいちご狩りと蘇我馬子の墓・石舞台古墳)。
 * #1〜#3で学んだ決まり(お金の話をしない・「〜しましょう」調・会社名を出さない・
 * 昼食をスポットとして分ける・ぼかしは出典と同じ強さで同じ文に・座標は実点・
 * お参りの一文は「お参りください」の形)を最初から反映する。あわせて、既存データの
 * 時刻の矛盾(石舞台古墳の到着時刻が移動時間と合っていない)も直す。
 *
 * - 奈良県立万葉文化館（昼食）: 県立の文化施設(私企業の名前ではない)
 * - 甘樫丘: 『日本書紀』の蘇我蝦夷・入鹿の邸宅の記述と、発掘調査では邸宅跡と確定
 *   できる遺構はまだ見つかっていないことの両方を記載(tabi-mag.jp/na0407/で確認)
 * - 橘寺: 聖徳太子の誕生地という「伝承」として記載(史実として確定はしていない。
 *   tabi-mag.jp/na0079/で確認)
 * - 岡寺: 寺伝(史実として確定はしていない)としての創建年・龍蓋池の伝説を記載
 *   (tabi-mag.jp/na0043/で確認)
 * - 高松塚壁画館: 本物の壁画は取り出されて修理・保存されており、展示は模写や
 *   レプリカが中心であることを記載
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-04-asuka";

const ITIN_ID = "14a5c98b-444e-4431-8997-f4694aa19afe";
const DAY_ID = "bfe1386c-a512-4723-b195-a67fd732e311";
const ISHIBUTAI_SPOT_ID = "c7270a6b-33a1-4af8-bf7b-6169396e5dbb";
const ISHIBUTAI_TRANSIT_ID = "b066e935-50b1-4ed2-8441-305aa19deb33";
const ASUKADERA_SPOT_ID = "7972da74-e6fd-4573-ac32-8facd89dd0e4";

const NEW_DESCRIPTION =
  "明日香村のいちご狩りパークで「あすかルビー」を味わったあと、蘇我馬子の墓と伝わる特別史跡・石舞台古墳、日本最古の仏像「飛鳥大仏」で知られる飛鳥寺をめぐります。奈良県立万葉文化館で昼食をとり、甘樫丘、聖徳太子の誕生地と伝わる橘寺、西国三十三所の岡寺、高松塚壁画館をめぐる、飛鳥の歴史を感じる日帰りプランです。";

const MANYO_MEMO =
  "奈良県立の文化施設で、万葉集にゆかりの深い飛鳥の地に立ちます。万葉集の歌の世界を、日本画や資料、映像などで紹介しています。館内の飲食施設で、ここで昼食をとりましょう。";

const AMAKASHI_MEMO =
  "飛鳥の里を見渡せる小高い丘です。『日本書紀』には、飛鳥時代の権力者・蘇我蝦夷と子の入鹿が、この丘に邸宅を構えたと記されています。発掘調査では焼けた木材や壁土などが見つかっていますが、邸宅跡と確定できる遺構はまだ見つかっていません。展望台からは、大和三山をはじめとする飛鳥の風景を一望できます。";

const TACHIBANADERA_MEMO =
  "聖徳太子の誕生地と伝わる寺で、太子が建てたとされる「聖徳太子建立七大寺」の一つに数えられています。創建年代ははっきりしておらず、かつては66の堂塔を備えた大寺だったと伝わりますが、中世以降に衰え、現在の本堂は江戸時代末期の再建です。境内には、人の心の善悪二面を表すと伝わる二面石があります。";

const OKADERA_MEMO =
  "正式名称は東光山真珠院龍蓋寺で、西国三十三所第7番札所です。寺伝では、天智2年(663)に義淵僧正が創建したとされます。境内の龍蓋池には、義淵僧正が悪い龍を封じて大きな石で蓋をしたという伝説が伝わり、これが寺名の由来とされています。「日本最初の厄除け霊場」として知られています。本尊の如意輪観音坐像は、塑像としては日本最大とされています。";

const TAKAMATSUZUKA_MEMO =
  "極彩色の壁画で知られる高松塚古墳(7世紀末から8世紀初めごろの築造とされる)に隣接する展示施設です。国宝に指定された本物の壁画は、古墳から取り出されて修理・保存されているため、ここでは壁画の原寸模写や、副葬品のレプリカ、石槨の原寸模型などを見ることができます。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { description: true } });
  const ishibutai = await prisma.spot.findUnique({ where: { id: ISHIBUTAI_SPOT_ID } });
  const asukadera = await prisma.spot.findUnique({ where: { id: ASUKADERA_SPOT_ID }, include: { photos: true } });
  if (!itin || !ishibutai || !asukadera) throw new Error("想定と違います");

  const manyoExisting = await prisma.placeMaster.findFirst({ where: { name: "奈良県立万葉文化館" } });
  if (!manyoExisting || !manyoExisting.photoUrl) throw new Error("万葉文化館の台帳(写真つき)が見つかりません");
  const amakashiExisting = await prisma.placeMaster.findUnique({ where: { id: "40814604-64f6-40d4-a5a2-6ffc3e70f33d" } });
  const tachibanaExisting = await prisma.placeMaster.findUnique({ where: { id: "dd10f460-e6aa-470d-b378-4fdeec4a9194" } });
  const okaExisting = await prisma.placeMaster.findUnique({ where: { id: "c85b3b7e-ed39-4b4e-95e1-d475462702f9" } });
  if (!amakashiExisting?.photoUrl || !tachibanaExisting?.photoUrl || !okaExisting?.photoUrl) throw new Error("甘樫丘・橘寺・岡寺の台帳(写真つき)が見つかりません");
  const takamatsuzukaDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "高松塚壁画館" } } });
  if (takamatsuzukaDup) throw new Error("台帳が既に存在します(想定外): 高松塚壁画館");

  console.log("[確認OK] 説明文を直す");
  console.log("[確認OK] 石舞台古墳の到着時刻の移動時間を直す(10分→20分)");
  console.log("[確認OK] 万葉文化館（昼食）・甘樫丘・橘寺・岡寺・高松塚壁画館を追加して16:30過ぎまで延ばす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spotTransitLeg.update({ where: { id: ISHIBUTAI_TRANSIT_ID }, data: { transitDurationMin: 20 } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: asukadera.placeMasterId! } }))!.prefectureAreaId;

  // 万葉文化館（昼食）: orderNo 4、飛鳥寺(12:10+45=12:55)から3分で12:58着、60分滞在
  // (既存の台帳「奈良県立万葉文化館」の写真を再利用)
  const manyoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: manyoExisting.id, orderNo: 4, name: "万葉文化館（昼食）",
      address: "奈良県高市郡明日香村飛鳥10", lat: 34.477341, lng: 135.822388,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 58)), memo: MANYO_MEMO, stayDurationMin: 60,
      websiteUrl: "https://www.pref.nara.lg.jp/manyo/index.html",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: manyoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });
  await prisma.photo.create({
    data: {
      spotId: manyoSpot.id, url: manyoExisting.photoUrl!, caption: "万葉文化館",
      sourceUrl: manyoExisting.photoSourceUrl, author: manyoExisting.photoAuthor,
      license: manyoExisting.photoLicense, licenseUrl: manyoExisting.photoLicenseUrl,
    },
  });

  // 甘樫丘: orderNo 5、万葉文化館(12:58+60=13:58)から3分で14:01着、30分滞在(既存台帳を再利用)
  const amakashiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: amakashiExisting.id, orderNo: 5, name: "甘樫丘",
      address: amakashiExisting.address, lat: amakashiExisting.lat, lng: amakashiExisting.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 1)), memo: AMAKASHI_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: amakashiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });
  await prisma.photo.create({
    data: {
      spotId: amakashiSpot.id, url: amakashiExisting.photoUrl!, caption: "甘樫丘",
      sourceUrl: amakashiExisting.photoSourceUrl, author: amakashiExisting.photoAuthor,
      license: amakashiExisting.photoLicense, licenseUrl: amakashiExisting.photoLicenseUrl,
    },
  });

  // 橘寺: orderNo 6、甘樫丘(14:01+30=14:31)から5分で14:36着、30分滞在(既存台帳を再利用)
  const tachibanaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: tachibanaExisting.id, orderNo: 6, name: "橘寺",
      address: tachibanaExisting.address, lat: tachibanaExisting.lat, lng: tachibanaExisting.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 36)), memo: TACHIBANADERA_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: tachibanaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: tachibanaSpot.id, url: tachibanaExisting.photoUrl!, caption: "橘寺",
      sourceUrl: tachibanaExisting.photoSourceUrl, author: tachibanaExisting.photoAuthor,
      license: tachibanaExisting.photoLicense, licenseUrl: tachibanaExisting.photoLicenseUrl,
    },
  });

  // 岡寺: orderNo 7、橘寺(14:36+30=15:06)から5分で15:11着、30分滞在(既存台帳を再利用)
  const okaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: okaExisting.id, orderNo: 7, name: "岡寺",
      address: okaExisting.address, lat: okaExisting.lat, lng: okaExisting.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 11)), memo: OKADERA_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: okaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: okaSpot.id, url: okaExisting.photoUrl!, caption: "岡寺",
      sourceUrl: okaExisting.photoSourceUrl, author: okaExisting.photoAuthor,
      license: okaExisting.photoLicense, licenseUrl: okaExisting.photoLicenseUrl,
    },
  });

  // 高松塚壁画館: orderNo 8、岡寺(15:11+30=15:41)から8分で15:49着、45分滞在(16:34終了)
  const takamatsuzukaResult = await uploadCommonsFile("Takamatsuzuka Hekigagan.jpg", "高松塚壁画館", BLOB_PREFIX);
  if (!takamatsuzukaResult) throw new Error("画像の取得・ライセンス確認に失敗しました(高松塚壁画館)");
  console.log("取得:", takamatsuzukaResult.url, takamatsuzukaResult.credit);
  const takamatsuzukaPlace = await prisma.placeMaster.create({
    data: {
      name: "高松塚壁画館", address: "奈良県高市郡明日香村平田439", lat: 34.462364, lng: 135.805939,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      photoUrl: takamatsuzukaResult.url, photoAuthor: takamatsuzukaResult.credit.author ?? null,
      photoLicense: takamatsuzukaResult.credit.license ?? null, photoLicenseUrl: takamatsuzukaResult.credit.licenseUrl ?? null,
      photoSourceUrl: takamatsuzukaResult.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const takamatsuzukaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: takamatsuzukaPlace.id, orderNo: 8, name: "高松塚壁画館",
      address: "奈良県高市郡明日香村平田439", lat: 34.462364, lng: 135.805939,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 49)), memo: TAKAMATSUZUKA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: takamatsuzukaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 8 } });
  await prisma.photo.create({
    data: {
      spotId: takamatsuzukaSpot.id, url: takamatsuzukaResult.url, caption: "高松塚壁画館",
      sourceUrl: takamatsuzukaResult.credit.sourceUrl ?? null, author: takamatsuzukaResult.credit.author ?? null,
      license: takamatsuzukaResult.credit.license ?? null, licenseUrl: takamatsuzukaResult.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED: #4 明日香村でいちご狩りと蘇我馬子の墓・石舞台古墳");
}
main().finally(() => prisma.$disconnect());
