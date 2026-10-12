/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ23。
 * 3枚目を足す段階(もと1枚だった186本のうち、バッチ22に続く10本)。表紙は変えない。
 *
 * 使う前にファイルの説明・分類・撮影地(都道府県)を必ず確かめた。
 * ca4cf898(新緑の蔵王ロープウェイ。春限定)は、候補スポットにCommonsの
 * 自由利用の写真が見つからず、見送って次の候補(158f73fa)に差し替えた。
 * 158f73fa「森八幡神社」は、Commonsのファイル名が「森水無八幡神社」だったが、
 * 日本語版ウィキペディアで同じ神社の通称と確認してから使った。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b23";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "eb84dc6b", spotName: "龍福寺（大内氏館跡）", fileTitle: "Path leading to Ryufukuji temple, Yamaguchi.jpg", caption: "龍福寺（大内氏館跡）" },
  { itinPrefix: "e72b89e7", spotName: "伊藤博文旧宅・別邸", fileTitle: "伊藤博文旧宅 - panoramio.jpg", caption: "伊藤博文旧宅・別邸" },
  { itinPrefix: "cc22e871", spotName: "東光寺", fileTitle: "Toukouji-Hagi 07.jpg", caption: "東光寺" },
  { itinPrefix: "9c2310be", spotName: "萩反射炉", fileTitle: "Hagi Reverberatory furnaces.JPG", caption: "萩反射炉" },
  { itinPrefix: "0986be13", spotName: "芭蕉・清風歴史資料館", fileTitle: "Basho Seifu History Museum 1.jpg", caption: "芭蕉・清風歴史資料館" },
  { itinPrefix: "6ccb23f9", spotName: "天童市将棋資料館", fileTitle: "Tendo shogi museum.jpg", caption: "天童市将棋資料館" },
  { itinPrefix: "d6badcd1", spotName: "武田神社", fileTitle: "KofuTakedaJinja1.jpg", caption: "武田神社" },
  { itinPrefix: "7e67c474", spotName: "大泉寺", fileTitle: "Daisenji 1.JPG", caption: "大泉寺" },
  { itinPrefix: "de637e2a", spotName: "金櫻神社", fileTitle: "Kanazakura-shrin Entrance.jpg", caption: "金櫻神社" },
  { itinPrefix: "158f73fa", spotName: "森八幡神社", fileTitle: "Moriminasi hatiman jinja.JPG", caption: "森八幡神社" },
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
