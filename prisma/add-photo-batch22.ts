/**
 * 写真の少ないしおりに写真を足す(docs/specs/20261012-photo-add.md)バッチ22。
 * 3枚目を足す段階(もと1枚だった186本のうち、バッチ21に続く10本)。表紙は変えない。
 *
 * 使う前にファイルの説明・分類・撮影地(都道府県)を必ず確かめた。
 * 5f3f7bd0(遠刈田温泉)は、候補スポット(駒草平・三階滝・惟喬神社など)に
 * Commonsの自由利用の写真が見つからず、見送って次の候補(b1d9788b)に差し替えた。
 * 惟喬神社は、検索で見つかった写真がすべて京都府の同名の別の神社と分かったため使わなかった
 * (似た名前の別の場所の確認手順で防いだケース)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b22";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "d45c6b3b", spotName: "白石城", fileTitle: "Shiroishi Castle.JPG", caption: "白石城" },
  { itinPrefix: "73f0b468", spotName: "瑞巌寺", fileTitle: "Matsushima, Zuiganji (2005) 01.jpg", caption: "瑞巌寺" },
  { itinPrefix: "0c07189d", spotName: "都井岬", fileTitle: "Wild horse of cape toi. - 都井岬の野生馬 - panoramio (9).jpg", caption: "都井岬" },
  { itinPrefix: "4051e181", spotName: "天安河原", fileTitle: "Amanoyasukawara.jpg", caption: "天安河原" },
  { itinPrefix: "94732fe1", spotName: "高千穂神社", fileTitle: "Takachiho-jinja Sando 2024.jpg", caption: "高千穂神社" },
  { itinPrefix: "af30d135", spotName: "サンメッセ日南", fileTitle: "日南太阳花园摩艾石像.jpg", caption: "サンメッセ日南" },
  { itinPrefix: "f8ed8e28", spotName: "五百羅漢", fileTitle: "GOHYAKURAKAN CHOUKEIJI.JPG", caption: "五百羅漢" },
  { itinPrefix: "3d8afccd", spotName: "白川郷", fileTitle: "Shirakawago Japanese Old Village 001.jpg", caption: "白川郷" },
  { itinPrefix: "b7c6d2e1", spotName: "美女平", fileTitle: "Bijodaira - panoramio.jpg", caption: "美女平" },
  { itinPrefix: "b1d9788b", spotName: "上梨白山宮", fileTitle: "Kaminashi Hakusangu (上梨白山宮本殿).jpg", caption: "上梨白山宮" },
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
