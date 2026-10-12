/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ20。
 * 3枚目を足す段階(もと1枚だった186本のうち、バッチ19に続く10本)。表紙は変えない。
 *
 * 鳥羽城跡での取り違えを踏まえ、使う前にファイルの説明・分類・撮影地(都道府県)を必ず確かめた。
 * (積丹の「黄金岬」は、留萌市の同名の場所の写真しか見つからなかったため、
 *  旧手宮線の写真に差し替えて進めた)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b20";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "38dec57e", spotName: "生田神社", fileTitle: "Ikuta Shrine Mar 2025 08.jpg", caption: "生田神社" },
  { itinPrefix: "cc984fa1", spotName: "大講堂・三之堂", fileTitle: "Engyoji daikodo2000s.jpg", caption: "大講堂・三之堂" },
  { itinPrefix: "c1204e30", spotName: "旧手宮線", fileTitle: "Temiya Line.jpg", caption: "旧手宮線" },
  { itinPrefix: "2b2188a6", spotName: "小野川沿いの町並み", fileTitle: "柳越しの佐原の街並み - panoramio.jpg", caption: "小野川沿いの町並み" },
  { itinPrefix: "bd51bb5e", spotName: "房総のむら", fileTitle: "Merchant's Houses (Boso no mura) 01.JPG", caption: "房総のむら" },
  { itinPrefix: "b70cea19", spotName: "日本寺（鋸山）", fileTitle: "Great Buddha at Nokogiriyama.JPG", caption: "日本寺（鋸山）" },
  { itinPrefix: "a66596b3", spotName: "大山千枚田", fileTitle: "Oyama Senmaida in Summer.JPG", caption: "大山千枚田" },
  { itinPrefix: "9822e442", spotName: "千畳敷", fileTitle: "Senjojiki (Shirahama) 20210724-1.jpg", caption: "千畳敷" },
  { itinPrefix: "9d8e49e5", spotName: "壇上伽藍・根本大塔", fileTitle: "Koyasan-danjyogaran-konpondaito.jpg", caption: "壇上伽藍・根本大塔" },
  { itinPrefix: "4124d576", spotName: "熊野那智大社", fileTitle: "Nachikatsuura Kumano-Nachi-taisha Courtyard 2.jpg", caption: "熊野那智大社" },
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
