/**
 * 法務の最終レビュー(2026-10-13 09:54、1272件全件と問題ありの写真一覧を突き合わせ)で
 * 見つかった1件を直す。
 * 雄島(福井県): 724件の最初の確認で「真上からの空撮」として外すと決めた写真
 * (Oshima_from_above.jpg)が、台帳に入っていた。Commonsに代わりの写真が見つからない
 * ため、台帳・公式しおり2スポット(うち1本は表紙)とも写真なしにする。表紙は、同じ
 * しおり内の唯一の他の写真(永平寺)に差し替える。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const OSHIMA_PLACE_ID = "6b2d373d-d2cb-4d43-bdb8-65d4f36c146e";
const OSHIMA_PHOTO_IDS = ["0cc3de81-7e87-41df-8494-30f5cd62609d", "bffc721e-d582-4334-97cc-76a9ee4f465d"];
const OSHIMA_COVER_ITIN_ID = "76714b9f-c63d-48ad-9f1d-264967be6714";
const EIHEIJI_PHOTO_URL = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/photoadd-20261012-b15/%25E6%25B0%25B8%25E5%25B9%25B3%25E5%25AF%25BA-eQKapyoLOGR0whrH0DkRZ0oPbumcAI.jpg";

async function main() {
  const place = await prisma.placeMaster.findUnique({ where: { id: OSHIMA_PLACE_ID } });
  const photos = await prisma.photo.findMany({ where: { id: { in: OSHIMA_PHOTO_IDS } } });
  const coverItin = await prisma.itinerary.findUnique({ where: { id: OSHIMA_COVER_ITIN_ID }, select: { thumbnailUrl: true } });
  if (!place || place.name !== "雄島") throw new Error("想定と違います: 雄島(台帳)");
  if (photos.length !== 2) throw new Error("想定と違います: 雄島(公式しおりの写真)");
  const coverPhoto = photos.find((p) => p.url === coverItin?.thumbnailUrl);
  if (!coverPhoto) throw new Error("想定と違います: 雄島(表紙)");
  console.log("[確認OK] 雄島: 台帳・公式しおり2スポットとも写真を外す。表紙は永平寺の写真に差し替え");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({
    where: { id: OSHIMA_PLACE_ID },
    data: { photoUrl: null, photoAuthor: null, photoLicense: null, photoLicenseUrl: null, photoSourceUrl: null },
  });
  await prisma.photo.deleteMany({ where: { id: { in: OSHIMA_PHOTO_IDS } } });
  await prisma.itinerary.update({ where: { id: OSHIMA_COVER_ITIN_ID }, data: { thumbnailUrl: EIHEIJI_PHOTO_URL } });
  console.log("  COMMITTED: 雄島(台帳・公式しおり2スポットの写真を削除、表紙を永平寺の写真に差し替え)");
}
main().finally(() => prisma.$disconnect());
