/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ11。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b11";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "881f9752", spotName: "トキの森公園", fileTitle: "Nipponia Nippon in Sado Ibis Conservation Center.jpg", caption: "トキの森公園" },
  { itinPrefix: "fa3afe40", spotName: "旧開智学校", fileTitle: "Former Kaichi School.jpg", caption: "旧開智学校" },
  { itinPrefix: "1bd66235", spotName: "鳥取砂丘", fileTitle: "Tottori Sand Dune.jpg", caption: "鳥取砂丘" },
  { itinPrefix: "9a6ec970", spotName: "千光寺", fileTitle: "Senkoji Onomichi16s3872.jpg", caption: "千光寺" },
  { itinPrefix: "f4665b0d", spotName: "座間味港", fileTitle: "Zamami port.JPG", caption: "座間味港" },
  { itinPrefix: "bb9c4e59", spotName: "殺生石", fileTitle: "Sessho-Seki Park, May 2022.jpg", caption: "殺生石" },
  { itinPrefix: "245d49ce", spotName: "不動院", fileTitle: "Fudoin Kondo.jpg", caption: "不動院" },
  { itinPrefix: "e0408f7b", spotName: "天赦園", fileTitle: "Tensyaen20210406 01.jpg", caption: "天赦園" },
  { itinPrefix: "24469e72", spotName: "塩屋埼灯台", fileTitle: "Shioya-zaki lighthouse 01.jpg", caption: "塩屋埼灯台" },
  { itinPrefix: "c77a7701", spotName: "千秋公園", fileTitle: "Kubota Castle, ruins of the Karakane-bashi bridge.jpg", caption: "千秋公園" },
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
