/**
 * バッチ23の確認で法務・企画運営から指摘を受けた直し。
 * 1. 撮影者の表示を、Commonsのファイルの説明欄をそのまま写すのではなく、
 *    実際の投稿者(アップロードした利用者名)に直す(5件)
 * 2. 6ccb23f9「天童市将棋資料館」の写真(Tendo_shogi_museum.jpg)は、
 *    入口に実在の人物(藤井聡太八段)の、その時だけのお祝いの大きな垂れ幕が
 *    写っているため、法務の指摘により外す。Commonsに垂れ幕のない代わりの
 *    写真が見つからなかったため、見送り(「今」を3→2に戻す)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

type AuthorFix = { photoId: string; oldAuthor: string | null; newAuthor: string };

const AUTHOR_FIXES: AuthorFix[] = [
  { photoId: "076d1fbd-6c9d-4c62-8cfc-ca10858dd0f3", oldAuthor: "myself.", newAuthor: "Corpse Reviver" },
  { photoId: "bdb60108-0138-4b34-9fc1-3766dd3e73ba", oldAuthor: null, newAuthor: "Fg2" },
  { photoId: "bd2b4d07-db92-48d5-9e15-4b50a7b8ffaf", oldAuthor: "ELK（投稿者）", newAuthor: "ELK" },
  { photoId: "e271ae36-c6e7-4722-869c-f83433843d88", oldAuthor: "ELK（投稿者）", newAuthor: "ELK" },
  { photoId: "28029dcd-3045-4472-be6b-d3caca992b6d", oldAuthor: "en:user:Fg2", newAuthor: "Fg2" },
];

const TENDO_PHOTO_ID = "e597516a-6ea7-4e23-8f9f-8110bc49cca2";

async function main() {
  for (const fix of AUTHOR_FIXES) {
    const photo = await prisma.photo.findUnique({ where: { id: fix.photoId } });
    if (!photo) throw new Error(`写真が見つかりません: ${fix.photoId}`);
    if (photo.author !== fix.oldAuthor) {
      throw new Error(`想定外の現在値です: ${fix.photoId} author=${photo.author}(期待値: ${fix.oldAuthor})`);
    }
    console.log(`[確認OK] ${fix.photoId}: "${fix.oldAuthor}" → "${fix.newAuthor}"`);
  }

  const tendoPhoto = await prisma.photo.findUnique({ where: { id: TENDO_PHOTO_ID } });
  if (!tendoPhoto) throw new Error("天童市将棋資料館の写真が見つかりません");
  if (tendoPhoto.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Tendo_shogi_museum.jpg") {
    throw new Error("想定外の出典です: " + tendoPhoto.sourceUrl);
  }
  console.log(`[確認OK] 天童市将棋資料館の写真を削除: ${TENDO_PHOTO_ID}`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const fix of AUTHOR_FIXES) {
    await prisma.photo.update({ where: { id: fix.photoId }, data: { author: fix.newAuthor } });
  }
  await prisma.photo.delete({ where: { id: TENDO_PHOTO_ID } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
