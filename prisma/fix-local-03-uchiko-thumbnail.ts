/**
 * 内子(承認待ち、212c78fa)のthumbnailUrl(表紙)の直し。写真の差し替え(高昌寺などの
 * 誤った写真を正しいものに変更)のあと、表紙の欄に古いURL(内子町のキーで取った
 * 内子座の写真)が残っていた(法務の指摘、2026-11-03)。高昌寺の新しい写真のURLに直す。
 * 古いBlobの画像は手で消さず、Cronの自動片づけに任せる。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "212c78fa-7224-4b15-9a65-dc3846057584";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const koshoji = await prisma.spot.findFirstOrThrow({
    where: { name: "高昌寺", day: { itineraryId: ITIN_ID } },
    include: { photos: true },
  });
  if (koshoji.photos.length !== 1) throw new Error(`高昌寺: 写真の枚数が期待(1)と不一致(${koshoji.photos.length})`);
  const newUrl = koshoji.photos[0].url;

  console.log(`現在のthumbnailUrl: ${itin.thumbnailUrl}`);
  console.log(`新しいthumbnailUrl: ${newUrl}`);
  if (itin.thumbnailUrl === newUrl) {
    console.log("すでに同じ値です。直しは不要です。");
    return;
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: newUrl } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
