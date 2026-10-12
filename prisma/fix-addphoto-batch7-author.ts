/**
 * add-photo-batch7で取得した7133c8fe(奥祖谷二重かずら橋)の撮影者欄に、MediaWikiの
 * 定型句「〇〇 at Japanese Wikipedia」が混ざっていたものを整える
 * (cleanAuthorNameに同じパターンを追加済み)。
 * "京浜にけ at Japanese Wikipedia" → "京浜にけ"
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FROM = "京浜にけ at Japanese Wikipedia";
const TO = "京浜にけ";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7133c8fe%'`);
  const itinId = rows[0].id;
  const photo = await prisma.photo.findFirst({ where: { spot: { name: "奥祖谷二重かずら橋", day: { itineraryId: itinId } } } });
  if (!photo) throw new Error("写真が見つかりません");
  if (photo.author !== FROM) throw new Error("撮影者の文言が想定外です: " + photo.author);
  console.log("確認OK。", photo.id);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.photo.update({ where: { id: photo.id }, data: { author: TO } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
