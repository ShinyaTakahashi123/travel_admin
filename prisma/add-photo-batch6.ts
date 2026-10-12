/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ6。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * eba4bb48(大森町並み)・73c2a636(倉敷民藝館)は、合う写真が見つからず見送り、
 * 代わりに22b14d35・5332b198を追加した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b6";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "e88cf598", spotName: "三朝温泉 株湯", fileTitle: "Kabuyu.JPG", caption: "三朝温泉 株湯" },
  { itinPrefix: "ce55cb0f", spotName: "倉吉白壁土蔵群", fileTitle: "Kurayoshi, Shirakabe-dozo-gun.jpg", caption: "倉吉白壁土蔵群" },
  { itinPrefix: "bb5348fc", spotName: "出雲日御碕灯台", fileTitle: "Hinomisaki Lighthouse01.jpg", caption: "出雲日御碕灯台" },
  { itinPrefix: "d686aaf2", spotName: "出雲大社", fileTitle: "Haiden of Izumo-taisha-1.JPG", caption: "出雲大社" },
  { itinPrefix: "c62de963", spotName: "武家屋敷", fileTitle: "Shiominawate Matsue04s4592.jpg", caption: "武家屋敷" },
  { itinPrefix: "c8eca5b1", spotName: "塩見縄手", fileTitle: "Shiomi Nawate street.JPG", caption: "塩見縄手" },
  { itinPrefix: "6062ae58", spotName: "岡山後楽園", fileTitle: "December view - Korakuen (Okayama) - DSC01650.JPG", caption: "岡山後楽園" },
  { itinPrefix: "5bc07d20", spotName: "大原美術館", fileTitle: "Kurashiki Ohara Art Museum02nt3200.jpg", caption: "大原美術館" },
  { itinPrefix: "22b14d35", spotName: "児島ジーンズストリート", fileTitle: "Kojima Jeans Street 2021-08 ac (1).jpg", caption: "児島ジーンズストリート" },
  { itinPrefix: "5332b198", spotName: "吉備津神社", fileTitle: "Kibitsu Jinja Corridor 01.JPG", caption: "吉備津神社" },
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
