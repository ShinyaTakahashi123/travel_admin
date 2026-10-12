/**
 * add-photo-batch15で付けた5e4fe4d0「吉崎御坊」の写真を、法務の指摘を受けて差し替える。
 * 旧写真(Rennyosyouninnkinennkann1.jpg)は山のふもとの蓮如上人記念館(新しい建物)だったが、
 * このスポットのメモは「御坊の建物こそ残っていませんが、史跡として整備され」と、
 * 山の上の吉崎御坊跡のことを書いている。山の上の蓮如上人銅像の写真に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b15fix";
const OLD_SOURCE = "https://commons.wikimedia.org/wiki/File:Rennyosyouninnkinennkann1.jpg";
const NEW_FILE_TITLE = "Bronze statue of Rennyo Syonin.jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  const photo = await prisma.photo.findFirst({ where: { spot: { name: "吉崎御坊", day: { itineraryId: itinId } } } });
  if (!photo) throw new Error("写真が見つかりません");
  if (photo.sourceUrl !== OLD_SOURCE) throw new Error("出典が想定外です: " + photo.sourceUrl);
  console.log("確認OK。", photo.id, photo.url);

  if (!COMMIT) return console.log("確認モードです。--commit で取得・差し替えます。");

  const result = await uploadCommonsFile(NEW_FILE_TITLE, "吉崎御坊", BLOB_PREFIX);
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
