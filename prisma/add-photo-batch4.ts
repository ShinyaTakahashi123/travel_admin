/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ4。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * 45f439eb(佐嘉神社)・c599bbfc(伊萬里神社・鍋島藩窯公園)は、2枚目に合う候補スポットの
 * 自由利用の写真が見つからなかったため見送り、代わりに7ffb8f61・9c656920を追加した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b4";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "f507e490", spotName: "松本城", fileTitle: "Matsumoto Castle Keep Tower.jpg", caption: "松本城" },
  { itinPrefix: "84dca3bf", spotName: "田代池", fileTitle: "Kamikochi Tashiro ike01n4272.jpg", caption: "田代池" },
  { itinPrefix: "6ac78863", spotName: "一の瀬草原 まいめの池", fileTitle: "Nagano-Maime Pond-xl.jpg", caption: "一の瀬草原 まいめの池" },
  { itinPrefix: "069ec35c", spotName: "白糸ノ滝", fileTitle: "Shiraito Falls (Fujinomiya).jpg", caption: "白糸ノ滝" },
  { itinPrefix: "aea12c13", spotName: "白糸の滝", fileTitle: "Shiraito Falls (Fujinomiya).jpg", caption: "白糸の滝" },
  { itinPrefix: "66d185f1", spotName: "ふもとっぱら", fileTitle: "2018-03-18 The camper at the foot of Mt. Fuji.jpg", caption: "ふもとっぱら" },
  { itinPrefix: "720bdfcb", spotName: "陶山神社", fileTitle: "Tozan Shrine01.jpg", caption: "陶山神社" },
  { itinPrefix: "d0a83d9f", spotName: "波戸岬", fileTitle: "Cape Hado 1.jpg", caption: "波戸岬" },
  { itinPrefix: "7ffb8f61", spotName: "唐津城", fileTitle: "Karatsu Castle (39163027).jpg", caption: "唐津城" },
  { itinPrefix: "9c656920", spotName: "海地獄", fileTitle: "Beppu Umi-jigoku04n4272.jpg", caption: "海地獄" },
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
