/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ15。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * 11ddbe6f(阿嘉島・ニシハマビーチ)は当初「前浜ビーチ」を検討したが
 * 合う写真が見つからず、「中岳展望台」に差し替えた。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b15";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "1a76df9e", spotName: "妖怪神社", fileTitle: "境港水木ロード妖怪神社PA098302.JPG", caption: "妖怪神社" },
  { itinPrefix: "11ddbe6f", spotName: "中岳展望台", fileTitle: "View of Aka and Geruma Island,Okinawa JAPAN.jpg", caption: "中岳展望台" },
  { itinPrefix: "0c07189d", spotName: "堀切峠", fileTitle: "Horikiri Pass Miyazaki 2016.JPG", caption: "堀切峠" },
  { itinPrefix: "76714b9f", spotName: "永平寺", fileTitle: "Eiheiji08bs3200.jpg", caption: "永平寺" },
  { itinPrefix: "d7672ba8", spotName: "白水阿弥陀堂", fileTitle: "Shiramizu Amida-do Hall.jpg", caption: "白水阿弥陀堂" },
  { itinPrefix: "f3c75865", spotName: "ねぶたの家 ワ・ラッセ", fileTitle: "Nebuta Museum Wa Rasse exterior.jpg", caption: "ねぶたの家 ワ・ラッセ" },
  { itinPrefix: "df1b08b1", spotName: "尖閣湾揚島遊園", fileTitle: "Senkakuwan Sado-2.jpg", caption: "尖閣湾揚島遊園" },
  { itinPrefix: "5e4fe4d0", spotName: "吉崎御坊", fileTitle: "Rennyosyouninnkinennkann1.jpg", caption: "吉崎御坊" },
  { itinPrefix: "0cfa8e34", spotName: "桜の馬場 城彩苑", fileTitle: "Sakuranobaba-Josaien Museum near Kumamoto Castle.JPG", caption: "桜の馬場 城彩苑" },
  { itinPrefix: "d2cbf909", spotName: "金刀比羅宮 奥社（厳魂神社）", fileTitle: "Izutama-jinja Kotohira-gu01n4592.jpg", caption: "金刀比羅宮 奥社（厳魂神社）" },
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
