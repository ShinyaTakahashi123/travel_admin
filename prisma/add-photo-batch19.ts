/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ19。
 * ここから3枚目を足す段階(まず、もと1枚だった169本から)。表紙は変えない。
 *
 * 鳥羽城跡での取り違え(法務の指摘)を踏まえ、このバッチからは
 * ファイルの説明・分類・撮影地(都道府県)を必ず確かめてから使った。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b19";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "66782e35", spotName: "海の博物館", fileTitle: "Toba Sea-Folk Museum01.jpg", caption: "海の博物館" },
  { itinPrefix: "97f2f003", spotName: "倭姫宮", fileTitle: "Yamatohime-no-miya, shaden-1.jpg", caption: "倭姫宮" },
  { itinPrefix: "578b155e", spotName: "イルカ島", fileTitle: "View from Dolphin Island observation deck 1.jpg", caption: "イルカ島" },
  { itinPrefix: "1d70017a", spotName: "答志島", fileTitle: "Tōshijima.jpg", caption: "答志島" },
  { itinPrefix: "c599bbfc", spotName: "伊万里市陶器商家資料館", fileTitle: "Imari Pottery Merchant Museum 260505.jpg", caption: "伊万里市陶器商家資料館" },
  { itinPrefix: "d0a83d9f", spotName: "特別史跡名護屋城跡", fileTitle: "Yobuko Bridge from Hizen Nagoya Castle.jpg", caption: "特別史跡名護屋城跡" },
  { itinPrefix: "45f439eb", spotName: "佐嘉神社", fileTitle: "Shimmon Gate of Saga Shrine from inner side.jpg", caption: "佐嘉神社" },
  { itinPrefix: "720bdfcb", spotName: "泉山磁石場", fileTitle: "Izumiyama Ceramic Stone Field, Arita - Nov 9, 2010 (1).jpg", caption: "泉山磁石場" },
  { itinPrefix: "7ffb8f61", spotName: "七ツ釜", fileTitle: "Nanatsugama from view place 2016-09-06 01.jpg", caption: "七ツ釜" },
  { itinPrefix: "0fe4fa73", spotName: "六甲ガーデンテラス", fileTitle: "Rokko garden terrace01s3200.jpg", caption: "六甲ガーデンテラス" },
];

async function main() {
  for (const task of TASKS) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${task.itinPrefix}%'`);
    const itinId = rows[0].id;
    const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { title: true } });
    const spot = await prisma.spot.findFirst({
      where: { name: task.spotName, day: { itineraryId: itinId } },
      include: { photos: true },
    });
    if (!spot) throw new Error(`${task.itinPrefix}: スポットが見つかりません: ${task.spotName}`);
    if (spot.photos.length > 0) throw new Error(`${task.itinPrefix}: すでに写真があります`);
    console.log(`[確認OK] ${task.itinPrefix} ${itin!.title} | ${task.spotName}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const task of TASKS) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${task.itinPrefix}%'`);
    const itinId = rows[0].id;
    const spot = await prisma.spot.findFirst({ where: { name: task.spotName, day: { itineraryId: itinId } } });

    const result = await uploadCommonsFile(task.fileTitle, task.spotName, BLOB_PREFIX);
    if (!result) throw new Error(`${task.itinPrefix}: 画像の取得・ライセンス確認に失敗しました(${task.fileTitle})`);
    console.log(`${task.itinPrefix} 取得: ${result.url}`, result.credit);

    await prisma.photo.create({
      data: {
        spotId: spot!.id,
        url: result.url,
        caption: task.caption,
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
