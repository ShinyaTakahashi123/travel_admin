/**
 * 承認待ちしおりの見直し・新しい地域の分#21(9a0a0270、吉良川の町並みとキラメッセ室戸)。
 * いちご狩り#1〜#6で確立した決まり(お金の話をしない・「〜しましょう」調・会社名を
 * 出さない・座標は実点)に沿って、既存3スポット(いずれも元から決まりに沿った内容
 * だったため変更なし)はそのまま残し、4か所以上・9:30ごろ〜16:30〜17:00の決まりに
 * 合わせて新たに2か所を追加する。
 *
 * - 室戸世界ジオパークセンター: 公式サイト(muroto-geo.jp)で開館時間・展示内容・
 *   ユネスコ世界ジオパーク認定年(2011)を確認。入館料には触れない
 * - 室戸岬灯台: tabi-mag.jp等で初点灯年(1899)・現存鉄造灯台として最古クラス・
 *   「第一等レンズ」(フレネルレンズの最大級区分)を確認。「直径2.6m」という数字は
 *   裏付けが取れなかったため使わない
 * - 両スポットとも、座標はOSMの実点(建物の輪郭の頂点)を使用。GSIの番地検索では
 *   ジオパークセンターの住所(室戸岬町1810-2)が約6km離れた誤った位置を返したため、
 *   OSMの建物データで裏を取った
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea21-muroto";

const ITIN_ID = "9a0a0270-af81-41a6-888d-674f696f176e";
const DAY_ID = "92134a17-0406-4b65-aafb-e31f1d5fc138";
const SUIZOKUKAN_SPOT_ID = "04e45786-efe5-440e-a939-7a39e791e4e8";

const NEW_DESCRIPTION =
  "備長炭の集散地として栄えた吉良川の古い町並みから、鯨の歴史を伝える道の駅・キラメッセ室戸、廃校を生かしたむろと廃校水族館をめぐります。室戸世界ジオパークセンターと室戸岬灯台で、室戸の大地と海の歴史にもふれる日帰りプランです。";

const GEOPARK_MEMO =
  "室戸岬の先端近くに建つ、室戸ジオパークの拠点施設です。平成23年(2011)、ユネスコの世界ジオパークネットワークへの加盟が認定されました。館内には、大地の成り立ちや、厳しい自然とともに生きてきた人々の暮らしを紹介する展示コーナーのほか、大型スクリーンで室戸の大地と海を紹介するジオシアターがあります。";

const TODAI_MEMO =
  "室戸岬の突端に立つ、明治32年(1899)に初点灯した白亜の灯台です。現存する鉄造灯台としては、佐渡島の姫埼灯台に次いで古いものとされ、海上保安庁の保存灯台にも選ばれています。フレネルレンズの中でも最大級とされる「第一等レンズ」を備え、太平洋を行き交う船の安全を見守ってきました。内部は通常非公開ですが、灯台から望む太平洋の眺めは必見です。";

async function main() {
  const suizokukan = await prisma.spot.findUnique({ where: { id: SUIZOKUKAN_SPOT_ID } });
  if (!suizokukan) throw new Error("想定と違います");

  const geoDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "ジオパーク" } } });
  const todaiDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "室戸岬灯台" } } });
  if (geoDup || todaiDup) throw new Error("台帳が既に存在します(想定外、再利用を検討すること)");

  console.log("[確認OK] 説明文を直す(新しい2スポットを追加)");
  console.log("[確認OK] 室戸世界ジオパークセンター・室戸岬灯台を追加して16:30まで延ばす");

  const geoPhoto = await uploadCommonsFile("Muroto Geopark center 01.jpg", "室戸世界ジオパークセンター", BLOB_PREFIX);
  if (!geoPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(室戸世界ジオパークセンター)");
  console.log("取得:", geoPhoto.url, geoPhoto.credit);

  const todaiPhoto = await uploadCommonsFile("Murotomisaki Lighthouse 04.jpg", "室戸岬灯台", BLOB_PREFIX);
  if (!todaiPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(室戸岬灯台)");
  console.log("取得:", todaiPhoto.url, todaiPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: suizokukan.placeMasterId! } }))!.prefectureAreaId;

  // 室戸世界ジオパークセンター: orderNo 4、むろと廃校水族館(13:20+75=14:35)から20分で14:55着、50分滞在
  const geoPlace = await prisma.placeMaster.create({
    data: {
      name: "室戸世界ジオパークセンター", address: "高知県室戸市室戸岬町1810-2", lat: 33.2457607, lng: 134.1765512,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      photoUrl: geoPhoto.url, photoAuthor: geoPhoto.credit.author ?? null,
      photoLicense: geoPhoto.credit.license ?? null, photoLicenseUrl: geoPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: geoPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const geoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: geoPlace.id, orderNo: 4, name: "室戸世界ジオパークセンター",
      address: "高知県室戸市室戸岬町1810-2", lat: 33.2457607, lng: 134.1765512,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 55)), memo: GEOPARK_MEMO, stayDurationMin: 50,
      websiteUrl: "https://www.muroto-geo.jp/",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: geoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 20 } });
  await prisma.photo.create({
    data: {
      spotId: geoSpot.id, url: geoPhoto.url, caption: "室戸世界ジオパークセンター",
      sourceUrl: geoPhoto.credit.sourceUrl ?? null, author: geoPhoto.credit.author ?? null,
      license: geoPhoto.credit.license ?? null, licenseUrl: geoPhoto.credit.licenseUrl ?? null,
    },
  });

  // 室戸岬灯台: orderNo 5、ジオパークセンター(14:55+50=15:45)から5分で15:50着、40分滞在(16:30終了)
  const todaiPlace = await prisma.placeMaster.create({
    data: {
      name: "室戸岬灯台", address: "高知県室戸市室戸岬町", lat: 33.2472595, lng: 134.1755941,
      prefectureAreaId, category: "landmark", isWideArea: false, isMemorial: false,
      photoUrl: todaiPhoto.url, photoAuthor: todaiPhoto.credit.author ?? null,
      photoLicense: todaiPhoto.credit.license ?? null, photoLicenseUrl: todaiPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: todaiPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const todaiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: todaiPlace.id, orderNo: 5, name: "室戸岬灯台",
      address: "高知県室戸市室戸岬町", lat: 33.2472595, lng: 134.1755941,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)), memo: TODAI_MEMO, stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: todaiSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: todaiSpot.id, url: todaiPhoto.url, caption: "室戸岬灯台",
      sourceUrl: todaiPhoto.credit.sourceUrl ?? null, author: todaiPhoto.credit.author ?? null,
      license: todaiPhoto.credit.license ?? null, licenseUrl: todaiPhoto.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED: 新しい地域#21 吉良川の町並みとキラメッセ室戸");
}
main().finally(() => prisma.$disconnect());
