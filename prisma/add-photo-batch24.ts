/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ24。
 * 3枚目を足す段階(もと1枚だった186本のうち、バッチ23に続く10本)。表紙は変えない。
 *
 * 使う前にファイルの説明・分類・撮影地(都道府県)を必ず確かめた。
 * 22b14d35の「瀬戸大橋架橋記念公園」は、Commonsで見つかった「瀬戸大橋記念公園」の
 * 写真がいずれも香川県坂出市(本州側ではなく四国側)のものと分かったため、
 * 同じしおり内の「祇園神社」に変更した(似た名前の別の場所の確認で防いだケース)。
 * 8343727a「作山古墳」は、同じ読み(つくりやま)で字が違う「造山古墳」(岡山市)との
 * 混同に注意し、分類で「作山古墳(総社市)」であることを確かめてから使った。
 * 撮影者欄は、Commonsのuploader(投稿者)欄を確認してから記録した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b24";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "57b8650d", spotName: "金山巨石群", fileTitle: "Iwayaiwakage myouken.JPG", caption: "金山巨石群" },
  { itinPrefix: "b991287e", spotName: "荻町城跡展望台", fileTitle: "Overview of Ogimachi, Shirakawa, from the Ogimachi Castle observation point.jpg", caption: "荻町城跡展望台" },
  { itinPrefix: "746d20b3", spotName: "宗祇水", fileTitle: "Sougisui , 宗祇水 - panoramio.jpg", caption: "宗祇水" },
  { itinPrefix: "5bc07d20", spotName: "大橋家住宅", fileTitle: "Kurashiki Ohashi House01n4592.jpg", caption: "大橋家住宅" },
  { itinPrefix: "22b14d35", spotName: "祇園神社", fileTitle: "Gion Shinto shrine main shrine of Shimotsui.JPG", caption: "祇園神社" },
  { itinPrefix: "8343727a", spotName: "作山古墳", fileTitle: "Tsukuriyama Kofun (Soja), zenkei.jpg", caption: "作山古墳" },
  { itinPrefix: "73c2a636", spotName: "語らい座大原本邸", fileTitle: "211203 Old Ohara House Kurashiki Okayama pref Japan01s3.jpg", caption: "語らい座大原本邸" },
  { itinPrefix: "6062ae58", spotName: "夢二郷土美術館", fileTitle: "Yumeji Art Museum01s3200.jpg", caption: "夢二郷土美術館" },
  { itinPrefix: "5332b198", spotName: "鬼ノ城", fileTitle: "Kinojo Nishimon.JPG", caption: "鬼ノ城" },
  { itinPrefix: "62d86c73", spotName: "岡山神社", fileTitle: "Okayama Jinja 03.JPG", caption: "岡山神社" },
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
