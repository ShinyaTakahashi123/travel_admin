/**
 * 写真がなくなったしおりの写真探し(docs/content/20261012-photo-fill.md)バッチ1。
 * 8本、各1枚(+表紙)。すべてWikimedia Commonsの自由利用ライセンスの写真を
 * ファイルの説明・撮影地でスポットと一致することを確認済み。
 *
 * 38dec57e(北野異人館街)は、既存のthumbnailUrlが「六甲山」という名前の
 * 別の場所の写真だったため、正しい写真に差し替える(itinerary-wideの
 * thumbnailUrlを上書き。該当スポット自体にはまだ写真がなかった)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; note: string };

const TASKS: Task[] = [
  {
    itinPrefix: "57b8650d",
    spotName: "中山七里",
    fileTitle: "Nakayamashichiri_valley.JPG",
    note: "岐阜県下呂市三原の渓谷。ファイルの説明・ファイル名が中山七里と一致",
  },
  {
    itinPrefix: "0f38f1e6",
    spotName: "五色沼湖沼群（毘沙門沼）",
    fileTitle: "Bishamon-numa 03.jpg",
    note: "ファイルの説明 'Bishamon Pond (Bishamon-numa), the largest of Goshiki-numa volcanic lakes.' がスポットと一致",
  },
  {
    itinPrefix: "eba4bb48",
    spotName: "龍源寺間歩",
    fileTitle: "Iwami Silver Mine Ryugenji Tunnel 001.jpg",
    note: "ファイルの説明「島根県大田市にある石見銀山。銀採掘のための坑道の一つの龍源寺間歩内部。」がスポットと一致",
  },
  {
    itinPrefix: "97f2f003",
    spotName: "伊勢神宮外宮",
    fileTitle: "Geku_003.jpg",
    note: "Wikipedia「豊受大神宮」(伊勢神宮外宮の正式名称)のリード画像",
  },
  {
    itinPrefix: "38dec57e",
    spotName: "北野異人館街",
    fileTitle: "Kitano Street Kobe02s3s4272.jpg",
    note: "Wikipedia「北野町山本通」のリード画像。神戸市中央区北野町のスポットと一致",
  },
  {
    itinPrefix: "3d8afccd",
    spotName: "相倉合掌造り集落",
    fileTitle: "相倉合掌造り集落20221105-IMG_4688.jpg",
    note: "ファイルの説明「相倉合掌造り集落」がスポットと一致",
  },
  {
    itinPrefix: "b1d9788b",
    spotName: "菅沼合掌造り集落",
    fileTitle: "菅沼合掌造り集落20221105-IMG_4828.jpg",
    note: "ファイルの説明「菅沼合掌造り集落」がスポットと一致(相倉とは別の写真)",
  },
  {
    itinPrefix: "c4f58fdd",
    spotName: "たつこ像",
    fileTitle: "Lake Tazawa and Kansa-gū 20210213.jpg",
    note: "Wikipedia「田沢湖」のリード画像。御座石神社(Kansa-gū)も写っており、たつこ像の背景の田沢湖として使用",
  },
];

async function main() {
  for (const task of TASKS) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${task.itinPrefix}%'`);
    const itinId = rows[0].id;
    const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true, title: true } });
    const spot = await prisma.spot.findFirst({
      where: { name: task.spotName, day: { itineraryId: itinId } },
      include: { photos: true },
    });
    if (!spot) throw new Error(`${task.itinPrefix}: スポットが見つかりません: ${task.spotName}`);
    if (spot.photos.length > 0) throw new Error(`${task.itinPrefix}: すでに写真があります`);

    console.log(`[確認OK] ${task.itinPrefix} ${itin!.title} | ${task.spotName} | 既存表紙: ${itin!.thumbnailUrl ?? "なし"}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const task of TASKS) {
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${task.itinPrefix}%'`);
    const itinId = rows[0].id;
    const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
    const spot = await prisma.spot.findFirst({ where: { name: task.spotName, day: { itineraryId: itinId } } });

    const result = await uploadCommonsFile(task.fileTitle, task.spotName, BLOB_PREFIX);
    if (!result) throw new Error(`${task.itinPrefix}: 画像の取得・ライセンス確認に失敗しました(${task.fileTitle})`);

    console.log(`${task.itinPrefix} 取得: ${result.url}`, result.credit);

    await prisma.photo.create({
      data: {
        spotId: spot!.id,
        url: result.url,
        caption: task.spotName,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });

    // 38dec57eは既存の誤った表紙(別の場所の写真)を正しい写真に差し替える。
    // それ以外は表紙が未設定の場合のみ設定する
    if (task.itinPrefix === "38dec57e" || !itin!.thumbnailUrl) {
      await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: result.url } });
      console.log(`  表紙を設定(${task.itinPrefix === "38dec57e" ? "誤った写真から差し替え" : "新規"})`);
    }
  }

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
