/**
 * #27(87e30105)櫻正宗記念館「櫻宴」の写真を削除(法務指摘、2026-10-13)。
 * 今の写真(Poster_of_Sakura_Masamune_by_Kitano_Tsunetomi.jpg)は北野恒富に
 * よる古い広告ポスターの絵で、場所の写真ではなかった。Wikimedia Commonsで
 * 代わりの写真を探したが、見つかった実写真(Uozaki_Minamimachi_
 * Sakuramasamune_2025_a.jpg)は魚崎南町の通りの風景写真で、建物を主題と
 * した写真とは言えなかったため使わず、写真なしにする。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const PHOTO_ID = "23c74a12-cc67-408f-b136-4f41e9559e9b";

async function main() {
  const photo = await prisma.photo.findUnique({ where: { id: PHOTO_ID } });
  if (!photo) throw new Error("想定と違います(すでに削除済みの可能性)");

  console.log("[確認OK] 削除する写真:", photo.caption, photo.sourceUrl);

  if (!COMMIT) return console.log("\n確認モードです。--commit で削除します。");

  await prisma.photo.delete({ where: { id: PHOTO_ID } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
