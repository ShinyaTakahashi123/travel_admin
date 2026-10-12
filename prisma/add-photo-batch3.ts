/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ3。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * f8ed8e28(富山市ガラス美術館)・57b8650d(下呂発温泉博物館)は、2枚目に合う候補スポットの
 * 自由利用の写真が見つからなかったため見送り、代わりにcde2cce6・fd9af1f7を追加した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b3";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "951c2df1", spotName: "最勝院", fileTitle: "最勝院五重塔.jpg", caption: "最勝院" },
  { itinPrefix: "b7c6d2e1", spotName: "雷鳥沢", fileTitle: "Raichozawa (51830705662).jpg", caption: "雷鳥沢" },
  { itinPrefix: "3d8afccd", spotName: "菅沼合掌造り集落", fileTitle: "Gokayama suganuma.JPG", caption: "菅沼合掌造り集落" },
  { itinPrefix: "b1d9788b", spotName: "相倉合掌造り集落", fileTitle: "Gokayama Ainokura Gassho-zukuri 01.jpg", caption: "相倉合掌造り集落" },
  { itinPrefix: "7e67c474", spotName: "舞鶴城公園", fileTitle: "Kurogane Gate Kofu Castle.JPG", caption: "舞鶴城公園" },
  { itinPrefix: "de637e2a", spotName: "仙娥滝", fileTitle: "Shosenkyo-Waterfall.jpg", caption: "仙娥滝" },
  { itinPrefix: "d6badcd1", spotName: "仙娥滝", fileTitle: "Shosenkyo-Waterfall.jpg", caption: "仙娥滝" },
  { itinPrefix: "158f73fa", spotName: "温泉寺", fileTitle: "Onesen-ji (Gero) 20161228.jpg", caption: "温泉寺" },
  { itinPrefix: "cde2cce6", spotName: "白山神社", fileTitle: "白山神社（新潟市） Hakusan jinja - panoramio.jpg", caption: "白山神社" },
  { itinPrefix: "fd9af1f7", spotName: "北沢浮遊選鉱場跡", fileTitle: "Kitazawa Flotation Plant ac (1).jpg", caption: "北沢浮遊選鉱場跡" },
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
