/**
 * add-photo-batch10で付けたbc73fb84「見附島」の写真を、法務の指摘を受けて差し替える。
 * 旧写真(Mitsukejima_2019.jpg)は令和6年能登半島地震より前の姿で、
 * このスポットのメモ「地震で島の一部が崩れ、以前とは違う姿になっている」と食い違う。
 * 2026年4月撮影のNoto_Mitsuke-islands_2026-4.jpg(崩れた後の姿)に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b10fix";
const OLD_SOURCE = "https://commons.wikimedia.org/wiki/File:Mitsukejima_2019.jpg";
const NEW_FILE_TITLE = "Noto Mitsuke-islands 2026-4.jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'bc73fb84%'`);
  const itinId = rows[0].id;
  const photo = await prisma.photo.findFirst({ where: { spot: { name: "見附島", day: { itineraryId: itinId } } } });
  if (!photo) throw new Error("写真が見つかりません");
  if (photo.sourceUrl !== OLD_SOURCE) throw new Error("出典が想定外です: " + photo.sourceUrl);
  console.log("確認OK。", photo.id, photo.url);

  if (!COMMIT) return console.log("確認モードです。--commit で取得・差し替えます。");

  const result = await uploadCommonsFile(NEW_FILE_TITLE, "見附島", BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", result.url, result.credit);

  await prisma.photo.update({
    where: { id: photo.id },
    data: {
      url: result.url,
      sourceUrl: result.credit.sourceUrl ?? null,
      author: result.credit.author ?? null,
      license: result.credit.license ?? null,
      licenseUrl: result.credit.licenseUrl ?? null,
    },
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
