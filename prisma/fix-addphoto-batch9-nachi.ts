/**
 * add-photo-batch9で付けた4124d576(熊野古道 大門坂)「那智の滝」の写真を、
 * 法務の指摘(滝が道路の奥に小さく写っている)を受けて、滝が大きく写る写真に差し替える。
 * Nachikatsuura_Nachi_Falls_01.jpg → Nachikatsuura_Nachi_Falls_05.jpg(同じ撮影者Zairon、CC BY 4.0)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b9fix";
const OLD_SOURCE = "https://commons.wikimedia.org/wiki/File:Nachikatsuura_Nachi_Falls_01.jpg";
const NEW_FILE_TITLE = "Nachikatsuura Nachi Falls 05.jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '4124d576%'`);
  const itinId = rows[0].id;
  const photo = await prisma.photo.findFirst({ where: { spot: { name: "那智の滝", day: { itineraryId: itinId } } } });
  if (!photo) throw new Error("写真が見つかりません");
  if (photo.sourceUrl !== OLD_SOURCE) throw new Error("出典が想定外です: " + photo.sourceUrl);
  console.log("確認OK。", photo.id, photo.url);

  if (!COMMIT) return console.log("確認モードです。--commit で取得・差し替えます。");

  const result = await uploadCommonsFile(NEW_FILE_TITLE, "那智の滝", BLOB_PREFIX);
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
