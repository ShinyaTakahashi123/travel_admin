/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ8。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * 50822458(宇和島、南楽園・岩松の町並み)・8480e278(猪苗代湖、天鏡閣・土津神社・磐梯山噴火記念館)は
 * 合う写真(季節が合うものを含む)が見つからず見送った。今回は9本。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b8";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "206f3ee6", spotName: "和霊神社", fileTitle: "Warei Jinja Haiden.jpg", caption: "和霊神社" },
  { itinPrefix: "441b998a", spotName: "桂浜", fileTitle: "Kochi Katsurahama Daytime 1.JPG", caption: "桂浜" },
  { itinPrefix: "1756ab5e", spotName: "四万十川橋（赤鉄橋）", fileTitle: "Shimanto-gawa bashi.jpg", caption: "四万十川橋（赤鉄橋）" },
  { itinPrefix: "fa4c2ce4", spotName: "高知城", fileTitle: "Kochi Castle08s3872.jpg", caption: "高知城" },
  { itinPrefix: "9fa55366", spotName: "竜串海岸", fileTitle: "Tatsukushi 01.JPG", caption: "竜串海岸" },
  { itinPrefix: "148103cf", spotName: "延光寺", fileTitle: "Temple 39-Enkoji.jpg", caption: "延光寺" },
  { itinPrefix: "47214a80", spotName: "竜串海岸", fileTitle: "Tatsukushi 01.JPG", caption: "竜串海岸" },
  { itinPrefix: "0f38f1e6", spotName: "桧原湖遊覧船", fileTitle: "Mt.Bandai from Lake Hibara 01.jpg", caption: "桧原湖遊覧船" },
  { itinPrefix: "e1871a37", spotName: "鶴ヶ城", fileTitle: "Aizuwakamatsu Castle 04.jpg", caption: "鶴ヶ城" },
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
