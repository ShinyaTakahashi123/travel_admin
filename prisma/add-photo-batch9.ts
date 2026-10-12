/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ9。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * 66782e35(鳥羽城跡・相差海女文化資料館・石神さん)・1d70017a(答志島・鳥羽展望台・石神さん)は
 * 合う写真が見つからず見送り、代わりに4124d576・a0c34490を追加した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b9";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "be7a0462", spotName: "丸岡城", fileTitle: "Keep of Maruoka Castle 1.jpg", caption: "丸岡城" },
  { itinPrefix: "cd007650", spotName: "博物館明治村", fileTitle: "Meiji Mura 20220718 34.jpg", caption: "博物館明治村" },
  { itinPrefix: "4f2248ea", spotName: "帝国ホテル中央玄関", fileTitle: "ImperialHotelFacade.jpg", caption: "帝国ホテル中央玄関" },
  { itinPrefix: "20a8c441", spotName: "桃太郎神社", fileTitle: "Momotarō Shrine 20220707 02.jpg", caption: "桃太郎神社" },
  { itinPrefix: "5c004a8b", spotName: "豊橋市公会堂", fileTitle: "Toyohashi City Public Hall.jpg", caption: "豊橋市公会堂" },
  { itinPrefix: "310ab81d", spotName: "伊良湖岬灯台", fileTitle: "Irago Lighthouse s2.JPG", caption: "伊良湖岬灯台" },
  { itinPrefix: "97f2f003", spotName: "月夜見宮", fileTitle: "Tsukiyomi-no-miya(Geku) 01.JPG", caption: "月夜見宮" },
  { itinPrefix: "578b155e", spotName: "二見興玉神社", fileTitle: "Meotoiwa at Ise 01.JPG", caption: "二見興玉神社" },
  { itinPrefix: "4124d576", spotName: "那智の滝", fileTitle: "Nachikatsuura Nachi Falls 01.jpg", caption: "那智の滝" },
  { itinPrefix: "a0c34490", spotName: "青森銀行記念館", fileTitle: "Aomori Bank Memorial Bldg. at night 20200207.jpg", caption: "青森銀行記念館" },
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
