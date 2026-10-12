/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ21。
 * 3枚目を足す段階(もと1枚だった186本のうち、バッチ20に続く10本)。表紙は変えない。
 *
 * 使う前にファイルの説明・分類・撮影地(都道府県)を必ず確かめた。
 * 61ec95e9の「闇無浜神社」、27e93f15の「下ん湯」「由布院ステンドグラス美術館」は
 * Commonsに自由利用の写真が見つからず、同じしおり内の別スポットに変更した。
 * 27e93f15は冬限定のしおりのため、撮影時期が冬(2月)の写真を選んだ。
 * 駅(由布院駅など)は、しおりの決まりにより写真を付けなかった。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b21";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "4072c8d3", spotName: "六時の鐘", fileTitle: "Rokuzinokane.jpg", caption: "六時の鐘" },
  { itinPrefix: "b0b18b71", spotName: "宝登山神社", fileTitle: "Facade of Hodosan Shrine in Nagatoro, Saitama 1.png", caption: "宝登山神社" },
  { itinPrefix: "7d80c940", spotName: "武蔵一宮氷川神社", fileTitle: "氷川神社 本殿.JPG", caption: "武蔵一宮氷川神社" },
  { itinPrefix: "61ec95e9", spotName: "中津城", fileTitle: "Tenshu of Nakatsu Castle 3.jpg", caption: "中津城" },
  { itinPrefix: "84eb50c0", spotName: "寺町", fileTitle: "Teramachi Street in Nakatsu, Oita.jpg", caption: "寺町" },
  { itinPrefix: "9c656920", spotName: "鬼山地獄", fileTitle: "Oniyama Jigoku 251123.jpg", caption: "鬼山地獄" },
  { itinPrefix: "66258009", spotName: "狭霧台", fileTitle: "狭霧台からの湯布院.jpg", caption: "狭霧台" },
  { itinPrefix: "d5476601", spotName: "湯の坪街道", fileTitle: "Yunotsubo-Yokocho in Yufuin Hot Spring.JPG", caption: "湯の坪街道" },
  { itinPrefix: "27e93f15", spotName: "鬼石坊主地獄", fileTitle: "Oniishi Bozu-jigoku 20170217.jpg", caption: "鬼石坊主地獄" },
  { itinPrefix: "0df57d67", spotName: "一目八景", fileTitle: "Hitome-Hakkei in Shin-Yabakei Valley from observation deck 20141117-3.jpg", caption: "一目八景" },
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
