/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ14。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b14";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "2b2188a6", spotName: "香取神宮", fileTitle: "Katori-jingu haiden shomen.JPG", caption: "香取神宮" },
  { itinPrefix: "af30d135", spotName: "青島神社", fileTitle: "Aoshima jinja, Worship Hall 01.jpg", caption: "青島神社" },
  { itinPrefix: "f6f7102e", spotName: "朝倉館跡・唐門", fileTitle: "Ichijōdani Asakura Family Site 20231104 23.jpg", caption: "朝倉館跡・唐門" },
  { itinPrefix: "7f8fb644", spotName: "角館歴史村・青柳家", fileTitle: "Gate of Aoyagi Samurai House 20161106a.jpg", caption: "角館歴史村・青柳家" },
  { itinPrefix: "de14970e", spotName: "大山祇神社宝物館", fileTitle: "Gate of Oyamazumi Shrine Museum.jpg", caption: "大山祇神社宝物館" },
  { itinPrefix: "e0181f83", spotName: "大聖院", fileTitle: "500 Rakan statues, view from above, Daisho-in, Miyajima, Hatsukaichi, 2016.jpg", caption: "大聖院" },
  { itinPrefix: "746d20b3", spotName: "郡上八幡城", fileTitle: "Gujo hachiman castle P8117454.jpg", caption: "郡上八幡城" },
  { itinPrefix: "7135a922", spotName: "越前松島", fileTitle: "Echizenmatsushima.jpg", caption: "越前松島" },
  { itinPrefix: "a66596b3", spotName: "仁右衛門島", fileTitle: "Niemonjima seen from Futomi Port -July 2009 a.jpg", caption: "仁右衛門島" },
  { itinPrefix: "f6221e55", spotName: "旧金毘羅大芝居（金丸座）", fileTitle: "Kanamaruza 20191125 01.jpg", caption: "旧金毘羅大芝居（金丸座）" },
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
