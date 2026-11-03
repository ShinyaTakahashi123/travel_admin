/**
 * 竹田の写真まわりの直し(法務の指摘 2026-11-03)。
 * 1. 表紙(itinerary.thumbnailUrl)が、削除した郵便局の写真のままだったのを白水ダムの写真に直す。
 * 2. 白水ダムの写真の作者欄が、Commonsの「機械可読な情報なし」の注意書きの文のままだったのを
 *    「Tmizuk」(Commonsのファイル情報のAuthor=欄・利用者名。写真家名はTsutsui Mizuki)に直す。
 * 使い方: npm run prod -- npx tsx prisma/fix-taketa1-photo-cleanup.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "岡城跡と「荒城の月」ゆかりの地、竹田の城下町をめぐる日帰りプラン";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: TITLE },
    include: { days: { include: { spots: { include: { photos: true } } } } },
  });
  console.log("今の表紙:", it.thumbnailUrl);
  const damSpot = it.days.flatMap((d) => d.spots).find((s) => s.name === "白水ダム");
  const damPhoto = damSpot?.photos[0];
  if (!damPhoto) throw new Error("白水ダムの写真が見つかりません");
  console.log("新しい表紙:", damPhoto.url);
  console.log("作者 直す前:", damPhoto.author);
  console.log("作者 直した後: Tmizuk");

  if (commit) {
    await prisma.$transaction([
      prisma.itinerary.update({ where: { id: it.id }, data: { thumbnailUrl: damPhoto.url } }),
      prisma.photo.update({ where: { id: damPhoto.id }, data: { author: "Tmizuk" } }),
    ]);
    console.log("書き込みました。");
  } else {
    console.log("(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());
