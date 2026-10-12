/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ25。
 * 3枚目を足す段階(もと1枚だった186本のうち、バッチ24に続く10本)。表紙は変えない。
 *
 * 使う前にファイルの説明・分類・撮影地(都道府県)を必ず確かめた。
 * 撮影者欄は、CommonsのimageinfoのuploaderまたはArtist欄を確かめてから記録した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b25";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "04f797cf", spotName: "義経堂", fileTitle: "Takadachi Gikei-do Hall.jpg", caption: "義経堂" },
  { itinPrefix: "14ace463", spotName: "続石", fileTitle: "続石 - panoramio.jpg", caption: "続石" },
  { itinPrefix: "bb5348fc", spotName: "日御碕神社", fileTitle: "Hinomisaki-jinja Two-storied Gate 001.jpg", caption: "日御碕神社" },
  { itinPrefix: "eba4bb48", spotName: "佐毘売山神社", fileTitle: "Sahimeyama shrine near Iwami Ginzan Silver mine 1.jpg", caption: "佐毘売山神社" },
  { itinPrefix: "c62de963", spotName: "月照寺", fileTitle: "Gesshouji Temple in Matsue City - 松江市の月照寺 Turtle 1.jpg", caption: "月照寺" },
  { itinPrefix: "c8eca5b1", spotName: "明々庵", fileTitle: "Meimeian01n4592.jpg", caption: "明々庵" },
  { itinPrefix: "d686aaf2", spotName: "島根県立古代出雲歴史博物館", fileTitle: "Shimane Museum of Ancient Izumo 1.jpg", caption: "島根県立古代出雲歴史博物館" },
  { itinPrefix: "9a6ec970", spotName: "天寧寺三重塔", fileTitle: "Tenneiji Onomichi01s3872.jpg", caption: "天寧寺三重塔" },
  { itinPrefix: "5c0f7bb4", spotName: "弥山展望台", fileTitle: "MY - View from Mount Misen on Miyajima, Japan, 2015.jpg", caption: "弥山展望台" },
  { itinPrefix: "d4f3c053", spotName: "ネコの細道", fileTitle: "Narrow Path of Cats in Onomichi, Hiroshima 1.jpg", caption: "ネコの細道" },
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
