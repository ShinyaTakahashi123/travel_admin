/**
 * 写真がなくなったしおりの写真探し(docs/content/20261012-photo-fill.md)バッチ2。
 * 13本、各1枚(+表紙)。いずれもWikimedia Commonsの自由利用ライセンスの写真で、
 * ファイルの説明・撮影地でスポットと一致することを確認済み。
 *
 * ceb2a9a1(輪島朝市)は、本文(出張輪島朝市が輪島市宅田町のワイプラザ輪島店で
 * 営業中)を公式情報で確認し、現状と合っていることを確認済み(別途相談済み)。
 *
 * 5f3f7bd0(遠刈田温泉)は、既存のthumbnailUrlが、このしおりのどのスポットにも
 * 属さない写真(別のしおり「キツネと動物ふれあい…1泊2日」(8a15b42c)の
 * 「遠刈田温泉」スポットの写真)を指す、不正なまたがり参照だった
 * (このしおり自体には「遠刈田温泉」という名前のスポットがない)。新しく
 * 付ける御釜の写真で正しく上書きする。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012";

type Task = { itinPrefix: string; spotName: string; fileTitle: string };

const TASKS: Task[] = [
  { itinPrefix: "0c07189d", spotName: "都井岬灯台", fileTitle: "Toi_cape.jpg" },
  { itinPrefix: "e8cf096c", spotName: "水木しげるロード", fileTitle: "境港本町アーケード商店街2.JPG" },
  { itinPrefix: "6ac78863", spotName: "大正池", fileTitle: "Taisho_Pond_2011-09.jpg" },
  { itinPrefix: "50822458", spotName: "和霊神社", fileTitle: "Warei_Jinja_Haiden.jpg" },
  { itinPrefix: "df1b08b1", spotName: "大野亀", fileTitle: "佐渡島大野亀のトビシマカンゾウ.jpg" },
  { itinPrefix: "0c237404", spotName: "抱返り渓谷", fileTitle: "Dakigaeri_Gorge_and_Kamino-iwahashi_20201101.jpg" },
  { itinPrefix: "d0407258", spotName: "池田湖", fileTitle: "Lake_Ikeda_&_Mt.Kaimon.JPG" },
  { itinPrefix: "ca4cf898", spotName: "ドッコ沼", fileTitle: "Dokko-numa_20180902a.jpg" },
  { itinPrefix: "c10810bd", spotName: "桧木内川堤", fileTitle: "Cherry_blossom_along_the_Hinokinai_River_20180428a.jpg" },
  { itinPrefix: "66258009", spotName: "金鱗湖", fileTitle: "Lake_Kinrin.JPG" },
  { itinPrefix: "1d0aa24f", spotName: "清津峡渓谷トンネル", fileTitle: "Kiyotsukyo_Summer.jpg" },
  { itinPrefix: "ceb2a9a1", spotName: "白米千枚田", fileTitle: "Shiroyone_Senmaida_200906.jpg" },
  { itinPrefix: "5f3f7bd0", spotName: "御釜", fileTitle: "Zao_L.Okama.JPG" },
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

    // 5f3f7bd0は既存のthumbnailUrlが他のしおりのスポットを指す不正な参照のため上書きする
    if (!itin!.thumbnailUrl || task.itinPrefix === "5f3f7bd0") {
      await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: result.url } });
      console.log(`  表紙を設定(${task.itinPrefix === "5f3f7bd0" ? "不正な参照から差し替え" : "新規"})`);
    }
  }

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
