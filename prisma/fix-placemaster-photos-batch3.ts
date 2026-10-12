/**
 * 法務の2回目の抜き取り確認(2026-10-13 01:05)で見つかった2件を直す。
 * - ザ・ヴェランダ石打丸山: バス停の標識で施設が写っていない。Commonsに他の写真が
 *   見つからないため、台帳・公式しおりとも写真なしにする(公式しおり側は表紙だったため、
 *   同じしおり内の別スポットの写真に表紙を差し替える)。
 * - 奥入瀬渓流館: 一般的な渓流の写真で建物ではなかった。台帳のみ直す(公式しおり側の
 *   5スポットの使い回しは、企画運営の指示で「あとでよい」グループへ別途まとめて対応)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-3";

const VERANDA_PLACE_NAME = "ザ・ヴェランダ石打丸山";
const VERANDA_PREF = "新潟県";
const VERANDA_SPOT_ID = "a76b6f22-aef7-4583-b9f8-c0f676334e0b";
const VERANDA_ITIN_ID = "90e7362b-8ee7-412d-895f-21fdea5187f8";
// 同じしおり内で唯一写真がある「苗場ドラゴンドラ」の写真を表紙に差し替える
const DRAGONDORA_PHOTO_URL = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-13/%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%89%E3%83%A9-kKceblMWAXh1GwMNbAnt5ordi7Pre0.jpg";

const OIRASE_PLACE_NAME = "奥入瀬渓流館";
const OIRASE_PREF = "青森県";
const OIRASE_FILE_TITLE = "Oirase Keiryukan.jpg";

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  const verandaPlace = await prisma.placeMaster.findFirst({ where: { name: VERANDA_PLACE_NAME, prefectureAreaId: prefMap.get(VERANDA_PREF) || null } });
  if (!verandaPlace) throw new Error("台帳が見つかりません: " + VERANDA_PLACE_NAME);
  const verandaPhoto = await prisma.photo.findFirst({ where: { spotId: VERANDA_SPOT_ID } });
  if (!verandaPhoto) throw new Error("公式しおりの写真が見つかりません(ザ・ヴェランダ石打丸山)");
  const verandaItin = await prisma.itinerary.findUnique({ where: { id: VERANDA_ITIN_ID }, select: { title: true, thumbnailUrl: true } });
  if (!verandaItin || verandaItin.thumbnailUrl !== verandaPhoto.url) throw new Error("表紙の想定が違います(ザ・ヴェランダ石打丸山)");
  console.log(`[確認OK] ${VERANDA_PLACE_NAME}: 台帳の写真を外す / 公式しおりの写真を削除し、表紙を苗場ドラゴンドラの写真に差し替え`);

  const oirasePlace = await prisma.placeMaster.findFirst({ where: { name: OIRASE_PLACE_NAME, prefectureAreaId: prefMap.get(OIRASE_PREF) || null } });
  if (!oirasePlace) throw new Error("台帳が見つかりません: " + OIRASE_PLACE_NAME);
  console.log(`[確認OK] ${OIRASE_PLACE_NAME}: 台帳の写真を正しい建物の写真に差し替え`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({ where: { id: verandaPlace.id }, data: { photoUrl: null, photoAuthor: null, photoLicense: null, photoLicenseUrl: null, photoSourceUrl: null } });
  await prisma.photo.delete({ where: { id: verandaPhoto.id } });
  await prisma.itinerary.update({ where: { id: VERANDA_ITIN_ID }, data: { thumbnailUrl: DRAGONDORA_PHOTO_URL } });
  console.log("  COMMITTED: ザ・ヴェランダ石打丸山(台帳の写真を外す・公式しおりの写真を削除・表紙を差し替え)");

  const result = await uploadCommonsFile(OIRASE_FILE_TITLE, OIRASE_PLACE_NAME, BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました(" + OIRASE_FILE_TITLE + ")");
  console.log("取得:", result.url, result.credit);
  await prisma.placeMaster.update({
    where: { id: oirasePlace.id },
    data: {
      photoUrl: result.url,
      photoAuthor: result.credit.author ?? null,
      photoLicense: result.credit.license ?? null,
      photoLicenseUrl: result.credit.licenseUrl ?? null,
      photoSourceUrl: result.credit.sourceUrl ?? null,
    },
  });
  console.log("  COMMITTED: 奥入瀬渓流館(台帳の写真を差し替え)");
}
main().finally(() => prisma.$disconnect());
