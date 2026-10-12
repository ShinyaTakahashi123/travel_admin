/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ18。
 * 企画運営の指示により、見送っていた18本をもう一度探した結果。
 * 17本は見つかり、1本(03330540 青い池。冬限定)は、Commons・Flickrとも
 * 自由利用の冬の写真が見つからず、見送り(チェック表に「なし」と記録)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b18";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "f8ed8e28", spotName: "富山ガラス工房", fileTitle: "Toyama glass studio001.jpg", caption: "富山ガラス工房" },
  { itinPrefix: "c599bbfc", spotName: "伊萬里神社", fileTitle: "Imari Shrine 1.jpg", caption: "伊萬里神社" },
  { itinPrefix: "73c2a636", spotName: "倉敷市立美術館", fileTitle: "Kurashiki City Art Museam.JPG", caption: "倉敷市立美術館" },
  { itinPrefix: "1d70017a", spotName: "鳥羽城跡", fileTitle: "Tobayama Castle Site.jpg", caption: "鳥羽城跡" },
  { itinPrefix: "f839b893", spotName: "渦の道（大鳴門橋遊歩道）", fileTitle: "Whirlpools from Uzunomichi Promenade 5.jpg", caption: "渦の道（大鳴門橋遊歩道）" },
  { itinPrefix: "57b8650d", spotName: "巌立峡", fileTitle: "Gandate01.JPG", caption: "巌立峡" },
  { itinPrefix: "5f3f7bd0", spotName: "刈田嶺神社(里宮)", fileTitle: "Kattamine-jinja satomiya Haiden.jpg", caption: "刈田嶺神社(里宮)" },
  { itinPrefix: "a3e15012", spotName: "パレス ハウステンボス", fileTitle: "Palace Huis Ten Bosch 20140118.jpg", caption: "パレス ハウステンボス" },
  { itinPrefix: "c4c63223", spotName: "千尋の滝", fileTitle: "Senpiro Fall Yaku Island.jpg", caption: "千尋の滝" },
  { itinPrefix: "d0407258", spotName: "魚見岳展望台", fileTitle: "Chiringashima from Mount Uomidake 20180430.jpg", caption: "魚見岳展望台" },
  { itinPrefix: "eba4bb48", spotName: "大森町並み", fileTitle: "Nothing visitor in Omori Old Street by COVID-19 3rd wave now.jpg", caption: "大森町並み" },
  { itinPrefix: "8480e278", spotName: "土津神社", fileTitle: "Hanitsu Jinja.jpg", caption: "土津神社" },
  { itinPrefix: "50822458", spotName: "遊子水荷浦の段畑", fileTitle: "遊子水荷浦の段畑.jpg", caption: "遊子水荷浦の段畑" },
  { itinPrefix: "7d6f199f", spotName: "高浜海水浴場", fileTitle: "Takahama-beach.jpg", caption: "高浜海水浴場" },
  { itinPrefix: "45f439eb", spotName: "佐賀城本丸歴史館", fileTitle: "Saga Castle History Museum and Shachinomon Gate of Saga Castle.jpg", caption: "佐賀城本丸歴史館" },
  { itinPrefix: "66782e35", spotName: "鳥羽城跡", fileTitle: "Tobayama Castle Site.jpg", caption: "鳥羽城跡" },
  { itinPrefix: "c4f58fdd", spotName: "乳頭温泉郷", fileTitle: "Beech forest in Nyuto Onsenkyo (1).jpg", caption: "乳頭温泉郷" },
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
