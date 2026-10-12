/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ2。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * 5f3f7bd0(遠刈田温泉)は、合う自由利用の写真が見つからなかったため今回は見送り、
 * 代わりに14ace463(遠野ふるさと村)を追加した。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b2";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "cc984fa1", spotName: "摩尼殿", fileTitle: "Engyô-ji Temple - Mani-den.jpg", caption: "摩尼殿" },
  { itinPrefix: "4072c8d3", spotName: "金剛峯寺", fileTitle: "Kongobuji Temple, Koyasan, Japan - front facade.JPG", caption: "金剛峯寺" },
  { itinPrefix: "9d8e49e5", spotName: "奥の院", fileTitle: "OKU - Main approach through cedar forest at Okunoin, Koyasan, Japan, 2015.jpg", caption: "奥の院" },
  { itinPrefix: "9822e442", spotName: "円月島", fileTitle: "Engetsu Island 2016-03-27.jpg", caption: "円月島" },
  { itinPrefix: "bbc2264b", spotName: "三井寺（園城寺）", fileTitle: "Golden Hall - Mii-dera - Otsu, Shiga - DSC07238.JPG", caption: "三井寺（園城寺）" },
  { itinPrefix: "8662231d", spotName: "長浜城歴史博物館", fileTitle: "Nagahama Castle - Nagahama Castle Historical Museum 20200920 01.jpg", caption: "長浜城歴史博物館" },
  { itinPrefix: "73f0b468", spotName: "五大堂", fileTitle: "Matsushima Godaido 3.jpg", caption: "五大堂" },
  { itinPrefix: "d45c6b3b", spotName: "蔵王のお釜", fileTitle: "Zao L.Okama.JPG", caption: "蔵王のお釜" },
  { itinPrefix: "04f797cf", spotName: "中尊寺", fileTitle: "Golden Hall, Chusonji temple, Hiraizumi - Nov 13, 2011.jpg", caption: "中尊寺" },
  { itinPrefix: "14ace463", spotName: "遠野郷八幡宮", fileTitle: "Tonogohachimangu.jpg", caption: "遠野郷八幡宮" },
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
