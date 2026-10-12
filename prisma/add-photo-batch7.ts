/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ7。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * f839b893(渦の道・千畳敷展望台)は合う写真が見つからず見送り、代わりに6333f4ceを追加した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b7";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "eb84dc6b", spotName: "瑠璃光寺五重塔・香山公園", fileTitle: "Rurikoji temple pagoda in Spring.jpg", caption: "瑠璃光寺五重塔" },
  { itinPrefix: "cdc1ed6f", spotName: "鷲の門", fileTitle: "Washinomon Gate of Tokushima Castle.jpg", caption: "鷲の門" },
  { itinPrefix: "5c06f01a", spotName: "眉山", fileTitle: "Mount Bizan from Shimmachi River 20200607.jpg", caption: "眉山" },
  { itinPrefix: "de041462", spotName: "大塚国際美術館", fileTitle: "The Otsuka Museum of Art01s3200.jpg", caption: "大塚国際美術館" },
  { itinPrefix: "ac272e0b", spotName: "大麻比古神社", fileTitle: "Torii of Oasahiko Shrine.JPG", caption: "大麻比古神社" },
  { itinPrefix: "e4f374cb", spotName: "大歩危峡の遊覧船", fileTitle: "Tokushima Miyoshi Oboke Gorge Of Yoshino River 2.JPG", caption: "大歩危峡" },
  { itinPrefix: "789cfdef", spotName: "祖谷のかずら橋", fileTitle: "Iya Kazurabashi-1.jpg", caption: "祖谷のかずら橋" },
  { itinPrefix: "7133c8fe", spotName: "奥祖谷二重かずら橋", fileTitle: "Tokushima Miyoshi Okuiya Double Kazurabashi 3.JPG", caption: "奥祖谷二重かずら橋" },
  { itinPrefix: "bf4dd36f", spotName: "高松城跡・玉藻公園", fileTitle: "Takamatsu castle09s3872.jpg", caption: "高松城跡・玉藻公園" },
  { itinPrefix: "6333f4ce", spotName: "屋島", fileTitle: "Mt. Yashima.jpg", caption: "屋島" },
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
