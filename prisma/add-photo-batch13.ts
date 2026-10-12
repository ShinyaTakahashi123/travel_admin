/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ13。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b13";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "61ec95e9", spotName: "青の洞門・競秀峰", fileTitle: "Distant view of Ao-no-domon.jpg", caption: "青の洞門・競秀峰" },
  { itinPrefix: "e72b89e7", spotName: "円政寺", fileTitle: "Main Hall of Enseiji Temple.jpg", caption: "円政寺" },
  { itinPrefix: "cc22e871", spotName: "萩城跡", fileTitle: "Moat from stone wall of Hagi Castle 1.jpg", caption: "萩城跡" },
  { itinPrefix: "58c64d69", spotName: "さざえ堂", fileTitle: "Aizu Sazaedou 01.jpg", caption: "さざえ堂" },
  { itinPrefix: "5c0f7bb4", spotName: "千畳閣（豊国神社）", fileTitle: "Senjokaku 2011.JPG", caption: "千畳閣（豊国神社）" },
  { itinPrefix: "05bcbf89", spotName: "妙成寺", fileTitle: "Five-storied Pagoda, Myojo-ji 01 - Aug 17, 2012.jpg", caption: "妙成寺" },
  { itinPrefix: "d962010a", spotName: "鳥取砂丘", fileTitle: "Tottori Sand Dunes 02.jpg", caption: "鳥取砂丘" },
  { itinPrefix: "57863f76", spotName: "大洗サンビーチ", fileTitle: "Oarai Sun Beach,Ooarai-machi,Ibaraki,Japan - panoramio.jpg", caption: "大洗サンビーチ" },
  { itinPrefix: "d4f3c053", spotName: "西國寺", fileTitle: "西國寺 仁王門.jpg", caption: "西國寺" },
  { itinPrefix: "c946b414", spotName: "鳥取城跡・久松公園", fileTitle: "Sphere stone wall(Tenkyumaru,Tottori-castle ruins).jpg", caption: "鳥取城跡・久松公園" },
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
