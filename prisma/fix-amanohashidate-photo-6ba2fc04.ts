/**
 * 天橋立(6ba2fc04)の組み直し後の写真の確認(2026-11-04)。
 * 「天橋立」スポット(小天橋側の点に組み直し済み)に付いていた写真は、出典が
 * "Amanohashidate view from Kasamatsu Park"(傘松公園からの見下ろし)で、1か所目の
 * 傘松公園の表紙写真と同じ構図(見下ろし)。組み直し後の内容(小天橋のたもとでの地上からの
 * 散策)に合わないため外す。新しい「文珠」スポットはもともと写真なし(組み直しで新設)。
 * 企画運営の依頼(2026-11-04、書き込み後の写真確認)に基づく。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const HASHIDATE_PHOTO_ID = "146fcf1b-d4d7-458b-8c40-be9ff1f9f109";
const HASHIDATE_SPOT_ID = "3f62f981-c5ce-403d-8ed3-9e2aeb691917";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const photo = await prisma.photo.findUniqueOrThrow({ where: { id: HASHIDATE_PHOTO_ID } });
  if (photo.spotId !== HASHIDATE_SPOT_ID) throw new Error("前提確認: 写真のspotIdが期待と不一致");
  if (photo.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Amanohashidate_view_from_Kasamatsu_Park01s3s4410.jpg") {
    throw new Error("前提確認: 写真の出典が期待と不一致");
  }
  console.log(`前提の確認OK。写真 ${photo.id}(出典: ${photo.sourceUrl})を「天橋立」スポットから外します。`);
  console.log("理由: 傘松公園からの見下ろし写真で、1か所目(傘松公園)の表紙写真と同じ構図。組み直し後の小天橋側の内容に合わない。");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await prisma.photo.delete({ where: { id: HASHIDATE_PHOTO_ID } });
  console.log("書き込みました(写真を削除)。");
}
main().finally(() => prisma.$disconnect());
