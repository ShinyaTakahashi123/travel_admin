/**
 * バッチ18で付けた1d70017a・66782e35の「鳥羽城跡」の写真を差し替える。
 * 法務の指摘により、Tobayama_Castle_Site.jpgは三重県鳥羽市の鳥羽城跡ではなく、
 * 静岡県浜松市の鳥羽山城跡(別の場所、ファイル名の類似による取り違え)だったため。
 * 三重県鳥羽市の鳥羽城跡であることを分類・説明で確認した
 * Toba_Castle_鳥羽城三ノ丸_Aug_25,_2015.jpgに差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-tobajo-fix";
const OLD_SOURCE = "https://commons.wikimedia.org/wiki/File:Tobayama_Castle_Site.jpg";
const NEW_FILE_TITLE = "Toba Castle 鳥羽城三ノ丸 Aug 25, 2015.jpg";
const PREFIXES = ["1d70017a", "66782e35"];

async function main() {
  for (const prefix of PREFIXES) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${prefix}%'`);
    const itinId = rows[0].id;
    const photo = await prisma.photo.findFirst({ where: { spot: { name: "鳥羽城跡", day: { itineraryId: itinId } } } });
    if (!photo) throw new Error(`${prefix}: 写真が見つかりません`);
    if (photo.sourceUrl !== OLD_SOURCE) throw new Error(`${prefix}: 出典が想定外です: ` + photo.sourceUrl);
    console.log(`確認OK。${prefix}`, photo.id, photo.url);
  }

  if (!COMMIT) return console.log("確認モードです。--commit で取得・差し替えます。");

  for (const prefix of PREFIXES) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${prefix}%'`);
    const itinId = rows[0].id;
    const photo = await prisma.photo.findFirst({ where: { spot: { name: "鳥羽城跡", day: { itineraryId: itinId } } } });

    const result = await uploadCommonsFile(NEW_FILE_TITLE, "鳥羽城跡", BLOB_PREFIX);
    if (!result) throw new Error(`${prefix}: 画像の取得・ライセンス確認に失敗しました`);
    console.log(`${prefix} 取得:`, result.url, result.credit);

    await prisma.photo.update({
      where: { id: photo!.id },
      data: {
        url: result.url,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });
  }
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
