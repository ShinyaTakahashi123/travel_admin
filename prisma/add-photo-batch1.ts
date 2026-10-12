/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ1。
 * 写真1枚のしおり(186本)のうち10本に、2枚目の写真を足す。表紙は変えない。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b1";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "c1204e30", spotName: "小樽運河", fileTitle: "Otaru Canal 2009.jpg", caption: "小樽運河" },
  { itinPrefix: "6ccb23f9", spotName: "天童公園（舞鶴山）", fileTitle: "Osho statue at Mt Maizuru.jpg", caption: "天童公園（舞鶴山）" },
  { itinPrefix: "ca4cf898", spotName: "蔵王ロープウェイ", fileTitle: "Zao 2006 Ropeway.jpg", caption: "蔵王ロープウェイ" },
  { itinPrefix: "0986be13", spotName: "白銀の滝", fileTitle: "Shirogane-no-Taki Falls, Ginzan Onsen.jpg", caption: "白銀の滝" },
  { itinPrefix: "b991287e", spotName: "和田家", fileTitle: "Wada-ke house and Paddy field 2011-06-19.jpg", caption: "和田家" },
  { itinPrefix: "e4b7d41b", spotName: "西の河原公園", fileTitle: "251128 Sainokawara Park 20.jpg", caption: "西の河原公園" },
  { itinPrefix: "4d4d7a06", spotName: "西の河原公園", fileTitle: "251128 Sainokawara Park 20.jpg", caption: "西の河原公園" },
  { itinPrefix: "79f54318", spotName: "銚子大滝", fileTitle: "2021 Oirase Mountain Stream, Chōshi Falls 001.jpg", caption: "銚子大滝" },
  { itinPrefix: "7d80c940", spotName: "鉄道博物館", fileTitle: "The Railway Museum Park Zone 20071014 (1).jpg", caption: "鉄道博物館" },
  { itinPrefix: "b0b18b71", spotName: "長瀞岩畳", fileTitle: "Nagatoro Iwadatami in April 2024 1.png", caption: "長瀞岩畳" },
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
