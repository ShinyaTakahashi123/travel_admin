/**
 * #318の続き(任意の改善)。
 * 法務からの提案(2026-09-30 22:31)で、九谷焼窯跡展示館の場所違いの写真を
 * 外したあと「正しい写真を足すときは、撮影者名のあるものを選んで」と言われた。
 * 九谷焼窯跡展示館そのものの写真はWikimedia Commonsで見当たらなかったため
 * 見送るが、同じく写真が0件だった石川県九谷焼美術館には、ja.wikipedia
 * 「石川県九谷焼美術館」記事のリード画像(建物外観、撮影者クレジットあり)を
 * 既存の確立済みパイプライン(pilot-gen.tsのfetchAndUploadImage/
 * fetchImageCredit、Wikipediaのサムネイル→Commonsのextmetadataで
 * 撮影者・ライセンスを取得)で追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-318e-74759381.ts
 * (実行済み。既にPhotoがあれば何もしないため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { fetchAndUploadImage, fetchImageCredit } from "./lib/pilot-gen";

const ITIN_ID = "74759381-8ba1-4cc4-af19-4c1c523341be";
const BLOB_PREFIX = "official-areas-13";

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "石川県九谷焼美術館" },
    include: { photos: true },
  });
  if (museum.photos.length > 0) {
    console.log("already has a photo, skipping");
    return;
  }

  const imageCache = new Map<string, string | null>();
  const creditCache = new Map<string, Awaited<ReturnType<typeof fetchImageCredit>>>();
  const url = await fetchAndUploadImage(
    imageCache,
    { name: museum.name, wikiTitle: "石川県九谷焼美術館" } as any,
    BLOB_PREFIX,
    creditCache
  );
  if (!url) {
    console.log("画像取得失敗、写真なしのまま");
    return;
  }
  const credit = creditCache.get(museum.name);
  if (!credit || !credit.author || !credit.license || !credit.sourceUrl) {
    console.log("撮影者・ライセンス・出典URLがそろわなかったため見送り:", credit);
    return;
  }

  await prisma.photo.create({
    data: {
      spotId: museum.id,
      url,
      caption: museum.name,
      sourceUrl: credit.sourceUrl,
      author: credit.author,
      license: credit.license,
      licenseUrl: credit.licenseUrl ?? null,
    },
  });
  console.log("done:", { url, credit });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
