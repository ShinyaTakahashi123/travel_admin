/**
 * 写真がなくなったしおりの写真探し(docs/content/20261012-photo-fill.md)。
 * e88cf598「三朝温泉の株湯と温泉街さんぽ、倉吉の梨と中国庭園をめぐる日帰りプラン」。
 * まず1枚目: 中国庭園 燕趙園(鳥取県東伯郡湯梨浜町)。Wikipedia「燕趙園」の
 * リード画像 File:Enchoen01n4592.jpg(663highland、CC BY 2.5)を使用。
 * ファイルの説明が「燕趙園, 鳥取県湯梨浜町」でスポットの場所と一致することを
 * 事前にcommons/Wikipedia APIで確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { fetchAndUploadImage, fetchImageCredit } from "./lib/pilot-gen";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012";
const SPOT_NAME = "中国庭園 燕趙園";
const WIKI_TITLE = "燕趙園";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e88cf598%'`);
  const itinId = rows[0].id;
  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  const spot = await prisma.spot.findFirst({
    where: { name: SPOT_NAME, day: { itineraryId: itinId } },
    include: { photos: true },
  });
  if (!spot) throw new Error("スポットが見つかりません: " + SPOT_NAME);
  if (spot.photos.length > 0) throw new Error("すでに写真があります");

  console.log("対象スポット確認OK:", spot.name, spot.id);
  if (!COMMIT) return console.log("確認モードです。--commit で取得・書き込みます。");

  const imageCache = new Map<string, string | null>();
  const url = await fetchAndUploadImage(imageCache, { name: SPOT_NAME, wikiTitle: WIKI_TITLE } as any, BLOB_PREFIX);
  if (!url) throw new Error("画像の取得に失敗しました");
  const credit = await fetchImageCredit(WIKI_TITLE);
  if (!credit) throw new Error("ライセンス情報が取得できませんでした(自由利用ライセンスでない可能性)");

  console.log("取得した画像:", url, credit);

  await prisma.photo.create({
    data: {
      spotId: spot.id,
      url,
      caption: SPOT_NAME,
      sourceUrl: credit.sourceUrl ?? null,
      author: credit.author ?? null,
      license: credit.license ?? null,
      licenseUrl: credit.licenseUrl ?? null,
    },
  });

  if (!itin!.thumbnailUrl) {
    await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: url } });
    console.log("表紙にも設定しました");
  }

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
