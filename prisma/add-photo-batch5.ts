/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ5。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * a3e15012(ドムトールン)・d0407258(魚見岳展望台)・7d6f199f(鬼岳・井持浦教会)・
 * c4c63223(千尋の滝・屋久杉自然館)は、合う写真が見つからず見送り、代わりに
 * f4d8c218・d07a1c50・0d86de79を追加して10本にした。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b5";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "91dbe03a", spotName: "阿蘇神社", fileTitle: "Aso Shrine Torii.jpg", caption: "阿蘇神社" },
  { itinPrefix: "aecf9d8c", spotName: "米塚", fileTitle: "Mt.Komezuka 01.jpg", caption: "米塚" },
  { itinPrefix: "60af4db7", spotName: "九重“夢”大吊橋", fileTitle: "Kokonoe-Yume-Otsurihashi-1.jpg", caption: "九重“夢”大吊橋" },
  { itinPrefix: "357983ef", spotName: "鍋ヶ滝", fileTitle: "Nabegataki Falls, Kumamoto, Japan; July 2018 (01).jpg", caption: "鍋ヶ滝" },
  { itinPrefix: "949c4f43", spotName: "西海橋", fileTitle: "Saikai bridge.JPG", caption: "西海橋" },
  { itinPrefix: "bd3ec175", spotName: "弓張岳展望台", fileTitle: "Mount Yumihari Observatory 01.jpg", caption: "弓張岳展望台" },
  { itinPrefix: "be101c35", spotName: "長崎鼻", fileTitle: "長崎鼻からの開聞岳.jpg", caption: "長崎鼻" },
  { itinPrefix: "f4d8c218", spotName: "ウィルソン株", fileTitle: "Wilson Stump 01.jpg", caption: "ウィルソン株" },
  { itinPrefix: "d07a1c50", spotName: "益救神社", fileTitle: "Yaku Shrine Haiden.jpg", caption: "益救神社" },
  { itinPrefix: "0d86de79", spotName: "名護博物館", fileTitle: "Nago Museum 2025 01 31.jpg", caption: "名護博物館" },
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
