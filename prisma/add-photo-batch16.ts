/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ16。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * 0c237404(抱返り渓谷。春限定)は当初「西宮家」「大沼公園」を検討したが、
 * 雪の写真や合う写真が見つからず、「田沢湖クニマス未来館」に差し替えた。
 * c10810bd(桧木内川堤の桜並木。春限定)は当初「石黒家」「平福記念美術館」を検討したが、
 * いずれも秋・冬の写真しか見つからず、春の「武家屋敷通り（内町）」の桜の写真に差し替えた。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b16";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "0c237404", spotName: "田沢湖クニマス未来館", fileTitle: "Tazawako Kunimasu Miraikan exterior-1.jpg", caption: "田沢湖クニマス未来館" },
  { itinPrefix: "0aebca35", spotName: "渡嘉志久ビーチ", fileTitle: "Tokashiku beach.JPG", caption: "渡嘉志久ビーチ" },
  { itinPrefix: "41d548bb", spotName: "伊佐爾波神社", fileTitle: "Isaniwa Shrine Stairs.jpg", caption: "伊佐爾波神社" },
  { itinPrefix: "909049ad", spotName: "平久保崎", fileTitle: "Hirakubozaki, Ishigakijima 01.jpg", caption: "平久保崎" },
  { itinPrefix: "bd51bb5e", spotName: "成田山公園", fileTitle: "RyuchinoIke20100718.jpg", caption: "成田山公園" },
  { itinPrefix: "f39d3e76", spotName: "鑁阿寺", fileTitle: "Romon and Taiko-bashi, Banna-ji 20190502152837.jpg", caption: "鑁阿寺" },
  { itinPrefix: "c10810bd", spotName: "武家屋敷通り（内町）", fileTitle: "Bukeyashiki Street in Kakunodate 20060506.jpg", caption: "武家屋敷通り（内町）" },
  { itinPrefix: "f62dcf1c", spotName: "秋田県立美術館", fileTitle: "Entrance of Akita Museum of Art.jpg", caption: "秋田県立美術館" },
  { itinPrefix: "03a50000", spotName: "二十四の瞳映画村", fileTitle: "Twenty-four eyes11s3200.jpg", caption: "二十四の瞳映画村" },
  { itinPrefix: "8343727a", spotName: "備中国分寺", fileTitle: "Bitchu Kokubunji 1.JPG", caption: "備中国分寺" },
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
