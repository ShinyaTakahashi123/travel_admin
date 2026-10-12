/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ17。
 * 写真1枚のしおりに、2枚目の写真を足す。表紙は変えない。
 *
 * これで、1枚→2枚の対象のうち「見送り2本」を除く全本の処理が完了する見込み。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b17";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "66258009", spotName: "湯布院フローラルヴィレッジ", fileTitle: "Yufuin Floral Village.jpg", caption: "湯布院フローラルヴィレッジ" },
  { itinPrefix: "1d0aa24f", spotName: "湯沢高原ロープウェイ", fileTitle: "Yuzawa Kougen.jpg", caption: "湯沢高原ロープウェイ" },
  { itinPrefix: "b70cea19", spotName: "百尺観音", fileTitle: "Hyakushaku kannon.jpg", caption: "百尺観音" },
  { itinPrefix: "cc834a5c", spotName: "東尋坊", fileTitle: "Japan Tojinbo02n4592.jpg", caption: "東尋坊" },
  { itinPrefix: "ceb2a9a1", spotName: "總持寺祖院", fileTitle: "總持寺祖院経蔵.jpg", caption: "總持寺祖院" },
  { itinPrefix: "4051e181", spotName: "荒立神社", fileTitle: "Aratate Jinja Haiden 2022.jpg", caption: "荒立神社" },
  { itinPrefix: "0df57d67", spotName: "耶馬渓橋（オランダ橋）", fileTitle: "Yabakeibashi Bridge on Yamakunigawa River.jpg", caption: "耶馬渓橋（オランダ橋）" },
  { itinPrefix: "6ad59c82", spotName: "中山千枚田", fileTitle: "棚田の稲穂 - panoramio.jpg", caption: "中山千枚田" },
  { itinPrefix: "38dec57e", spotName: "メリケンパーク", fileTitle: "Kōbe Port Tower, Meriken Park (15871783216).jpg", caption: "メリケンパーク" },
  { itinPrefix: "e8cf096c", spotName: "夢みなとタワー", fileTitle: "Yumeminatotower Sakaiminato.jpg", caption: "夢みなとタワー" },
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
