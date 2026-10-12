/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ10。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b10";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "bc73fb84", spotName: "見附島", fileTitle: "Mitsukejima 2019.jpg", caption: "見附島" },
  { itinPrefix: "afb492ce", spotName: "角館武家屋敷通り", fileTitle: "Bukeyashiki Street in Kakunodate 20060926.jpg", caption: "角館武家屋敷通り" },
  { itinPrefix: "8912b8d0", spotName: "日光東照宮", fileTitle: "Winter Nikko shrine (52786837153).jpg", caption: "日光東照宮" },
  { itinPrefix: "d5476601", spotName: "宇奈岐日女神社", fileTitle: "Haiden and Shinkyo of Unaguhime Shrine 20141229.JPG", caption: "宇奈岐日女神社" },
  { itinPrefix: "27e93f15", spotName: "海地獄", fileTitle: "180131 Umi-Jigoku.jpg", caption: "海地獄" },
  { itinPrefix: "62d86c73", spotName: "岡山後楽園", fileTitle: "Okayama Korakuen Garden01.jpg", caption: "岡山後楽園" },
  { itinPrefix: "eebd52df", spotName: "湯沢高原パノラマパーク", fileTitle: "Yuzawa Kougen.jpg", caption: "湯沢高原パノラマパーク" },
  { itinPrefix: "04fcc64b", spotName: "ゲレンデ", fileTitle: "Southern area of Gala-Yuzawa Snow Resort.JPG", caption: "ゲレンデ" },
  { itinPrefix: "f7ff855f", spotName: "中町通り", fileTitle: "Nakamachi street Matsumoto Nagano pref Japan02s3.jpg", caption: "中町通り" },
  { itinPrefix: "043809ae", spotName: "座喜味城跡", fileTitle: "Zakimigusuku.jpg", caption: "座喜味城跡" },
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
