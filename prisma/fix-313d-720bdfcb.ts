/**
 * #313の続き(法務の指摘、必須、2026-09-30 19:32 JST)。
 * 表紙の写真「View_of_Arita_Station.jpg」(そらみみ)が、有田駅前の通り
 * (陶器市の飾り)を写したもので、有田内山伝統的建造物群スポットの
 * 実際の場所と異なっていた。既存の写真レコードを削除し、有田内山
 * 伝統的建造物群保存地区のWikipedia記事にひもづくWikimedia Commonsの
 * 写真(Arita Akaemachi potteries and porcelain stores street 01.JPG、
 * 内山地区・赤絵町の窯元通りを写したもの)を、確立済みの写真取得パイプ
 * ライン(fetchAndUploadImage/fetchImageCredit、著者名・ライセンスを
 * Wikimedia Commonsのメタデータから自動取得)で取得し直し、表紙にも
 * 設定する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313d-720bdfcb.ts
 * (実行済み。既存の誤った写真の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { fetchAndUploadImage, fetchImageCredit } from "./lib/pilot-gen";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";
const WRONG_SOURCE = "https://commons.wikimedia.org/wiki/File:View_of_Arita_Station.jpg";
const WIKI_TITLE = "有田町有田内山伝統的建造物群保存地区";

async function main() {
  const uchiyama = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "有田内山伝統的建造物群" },
  });

  const wrongPhoto = await prisma.photo.findFirst({ where: { spotId: uchiyama.id, sourceUrl: WRONG_SOURCE } });
  if (!wrongPhoto) {
    console.log("既に反映済み(誤った写真が無い)。何もしません。");
    return;
  }

  const imageCache = new Map<string, string | null>();
  const url = await fetchAndUploadImage(
    imageCache,
    { name: uchiyama.name, address: uchiyama.address ?? "", lat: uchiyama.lat!.toNumber(), lng: uchiyama.lng!.toNumber(), memo: "", websiteUrl: "", wikiTitle: WIKI_TITLE },
    "official-areas-15"
  );
  if (!url) {
    console.error("写真の取得に失敗しました。手動で確認してください。");
    process.exit(1);
  }
  const credit = await fetchImageCredit(WIKI_TITLE);

  await prisma.$transaction([
    prisma.photo.delete({ where: { id: wrongPhoto.id } }),
    prisma.photo.create({
      data: {
        spotId: uchiyama.id,
        url,
        caption: uchiyama.name,
        sourceUrl: credit?.sourceUrl ?? null,
        author: credit?.author ?? null,
        license: credit?.license ?? null,
        licenseUrl: credit?.licenseUrl ?? null,
      },
    }),
    prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: url } }),
  ]);

  console.log("done. new url:", url, "credit:", credit);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
