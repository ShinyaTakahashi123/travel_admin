/**
 * add-photo-batch4で取得したf507e490(松本城)の撮影者欄に、Exifの撮影機材コメントが
 * 混ざっていたものを整える。
 * "Lightning toothed whale (稲妻ノ歯鯨) This photo was" → "Lightning toothed whale (稲妻ノ歯鯨)"
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FROM = "Lightning toothed whale (稲妻ノ歯鯨) This photo was";
const TO = "Lightning toothed whale (稲妻ノ歯鯨)";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'f507e490%'`);
  const itinId = rows[0].id;
  const photo = await prisma.photo.findFirst({ where: { spot: { name: "松本城", day: { itineraryId: itinId } } } });
  if (!photo) throw new Error("写真が見つかりません");
  if (photo.author !== FROM) throw new Error("撮影者の文言が想定外です: " + photo.author);
  console.log("確認OK。", photo.id);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.photo.update({ where: { id: photo.id }, data: { author: TO } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
