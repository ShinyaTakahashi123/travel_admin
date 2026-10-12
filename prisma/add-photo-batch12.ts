/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ12。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * a295878b(東尋坊)は当初「雄島」を検討したが、合う写真が見つからず、
 * 同じしおりの「越前松島」スポットに差し替えた(Echizenmatsushima.jpgの説明文で場所を確認)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b12";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "a8d24b41", spotName: "榛名湖", fileTitle: "逆さ榛名富士 - panoramio.jpg", caption: "榛名湖" },
  { itinPrefix: "db3a13fc", spotName: "今治城", fileTitle: "Imabari Castle 01.JPG", caption: "今治城" },
  { itinPrefix: "a295878b", spotName: "越前松島", fileTitle: "Echizenmatsushima.jpg", caption: "越前松島" },
  { itinPrefix: "a71cf39b", spotName: "伊佐爾波神社", fileTitle: "Isaniwa Shrine Stairs.jpg", caption: "伊佐爾波神社" },
  { itinPrefix: "84eb50c0", spotName: "福澤諭吉旧居・福澤記念館", fileTitle: "Yukichi Fukuzawa old house 1.jpg", caption: "福澤諭吉旧居" },
  { itinPrefix: "94732fe1", spotName: "天安河原", fileTitle: "Amanoyasukawara.jpg", caption: "天安河原" },
  { itinPrefix: "9c2310be", spotName: "笠山", fileTitle: "Japan Sea from Mt Kasayama.JPG", caption: "笠山" },
  { itinPrefix: "7f723012", spotName: "水澤寺", fileTitle: "Mizusawa-dera Rokkakudo 02.jpg", caption: "水澤寺" },
  { itinPrefix: "d66711cc", spotName: "亀老山展望公園", fileTitle: "Kirousan tenboudai 20240521 1.jpg", caption: "亀老山展望公園" },
  { itinPrefix: "0fe4fa73", spotName: "瑞宝寺公園", fileTitle: "Zuihoji park01s3872.jpg", caption: "瑞宝寺公園" },
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
