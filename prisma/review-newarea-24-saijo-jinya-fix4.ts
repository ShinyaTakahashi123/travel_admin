/**
 * #24の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 伊予西条駅前・四国鉄道文化館・西条市観光交流センターの座標が3つとも同じ点
 *   (33.911625, 133.189255)だったため、OSMの実点にそれぞれ置き直す
 * 2. 西条市観光交流センター(観光案内の施設)の滞在50分は長すぎるため30分に戻し、
 *   西条市考古歴史館(福武乙27-6、八堂山遺跡の中腹、西条市公式の広報で開館時間
 *   9:00-17:00・休館月曜を確認)を新たに追加して16:30以降まで延ばす
 *   (#23では使わない: 伊曽乃神社・武丈公園・黒瀬湖を使う予定)
 * 3. 順番を、駅周辺の3か所(鉄道文化館→観光交流センター、ほぼ隣接)をまとめてから、
 *   少し離れた考古歴史館(八堂山、車で約8分)を最後にする形に組み直す
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea24-saijo";

const DAY_ID = "a2264601-1ab1-4914-b7d8-5835983c2413";
const EKIMAE_NAME = "伊予西条駅前（昼食）";
const TETSUDO_SPOT_ID = "e9d7359f-c94f-4c93-9952-e7653214e756";
const KORYU_SPOT_ID = "1cee668d-3d10-4cfd-9f0b-27c84ed1c7b7";

const KOKOREKISHIKAN_MEMO =
  "弥生時代後期の高地性集落跡として知られる八堂山遺跡の中腹、標高約196mの八堂山に建つ資料館です。平成3年(1991)に開館し、2階の展示室では、市内の遺跡から出土した土器や石器など、埋蔵文化財を見学できます。高台にあるため、周辺の眺めも楽しめます。";

async function main() {
  const ekimae = await prisma.spot.findFirst({ where: { name: EKIMAE_NAME, dayId: DAY_ID } });
  const tetsudo = await prisma.spot.findUnique({ where: { id: TETSUDO_SPOT_ID } });
  const koryu = await prisma.spot.findUnique({ where: { id: KORYU_SPOT_ID } });
  if (!ekimae || !tetsudo || !koryu) throw new Error("想定と違います");

  const ekimaeTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: ekimae.id, orderNo: 1 } });
  const tetsudoTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: tetsudo.id, orderNo: 1 } });
  const koryuTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: koryu.id, orderNo: 1 } });
  if (!ekimaeTransit || !tetsudoTransit || !koryuTransit) throw new Error("移動データが見つかりません");

  const kokorekishikanDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "考古歴史館" } } });
  if (kokorekishikanDup) throw new Error("台帳が既に存在します(想定外)");

  console.log("[確認OK] 伊予西条駅前・四国鉄道文化館・西条市観光交流センターの座標をOSM実点に直す");
  console.log("[確認OK] 観光交流センターの滞在を50分→30分に戻す");
  console.log("[確認OK] 西条市考古歴史館を追加し、順番を組み直して16:30以降まで延ばす");

  const kokoPhoto = await uploadCommonsFile("Saizyousikoukorekisikan 20230430 2.jpg", "西条市考古歴史館", BLOB_PREFIX);
  if (!kokoPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(西条市考古歴史館)");
  console.log("取得:", kokoPhoto.url, kokoPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: tetsudo.placeMasterId! } }))!.prefectureAreaId;

  // 1. 座標をOSM実点に直す
  await prisma.placeMaster.update({
    where: { id: ekimae.placeMasterId! },
    data: { lat: 33.9123657, lng: 133.1875768, positionSource: "osm" },
  });
  await prisma.spot.update({
    where: { id: ekimae.id },
    data: { lat: 33.9123657, lng: 133.1875768, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 55)) },
  });
  await prisma.spotTransitLeg.update({ where: { id: ekimaeTransit.id }, data: { transitDurationMin: 15 } });

  await prisma.placeMaster.update({
    where: { id: tetsudo.placeMasterId! },
    data: { lat: 33.9127432, lng: 133.1882405, positionSource: "osm" },
  });
  await prisma.spot.update({
    where: { id: TETSUDO_SPOT_ID },
    data: { lat: 33.9127432, lng: 133.1882405, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 57)) },
  });
  await prisma.spotTransitLeg.update({ where: { id: tetsudoTransit.id }, data: { transitDurationMin: 2 } });

  await prisma.placeMaster.update({
    where: { id: koryu.placeMasterId! },
    data: { lat: 33.9131578, lng: 133.1881218, positionSource: "osm" },
  });
  await prisma.spot.update({
    where: { id: KORYU_SPOT_ID },
    data: {
      lat: 33.9131578, lng: 133.1881218, orderNo: 6,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 29)), stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.update({ where: { id: koryuTransit.id }, data: { transitDurationMin: 2 } });

  // 2. 西条市考古歴史館: orderNo 7、観光交流センター(15:29+30=15:59)から8分で16:07着、45分滞在(16:52終了)
  const kokoPlace = await prisma.placeMaster.create({
    data: {
      name: "西条市考古歴史館", address: "愛媛県西条市福武乙27-6", lat: 33.8995683, lng: 133.197458,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      photoUrl: kokoPhoto.url, photoAuthor: kokoPhoto.credit.author ?? null,
      photoLicense: kokoPhoto.credit.license ?? null, photoLicenseUrl: kokoPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: kokoPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const kokoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: kokoPlace.id, orderNo: 7, name: "西条市考古歴史館",
      address: "愛媛県西条市福武乙27-6", lat: 33.8995683, lng: 133.197458,
      visitTime: new Date(Date.UTC(1970, 0, 1, 16, 7)), memo: KOKOREKISHIKAN_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kokoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 8 } });
  await prisma.photo.create({
    data: {
      spotId: kokoSpot.id, url: kokoPhoto.url, caption: "西条市考古歴史館",
      sourceUrl: kokoPhoto.credit.sourceUrl ?? null, author: kokoPhoto.credit.author ?? null,
      license: kokoPhoto.credit.license ?? null, licenseUrl: kokoPhoto.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
