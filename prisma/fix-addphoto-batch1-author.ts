/**
 * add-photo-batch1で取得したca4cf898(蔵王ロープウェイ)の撮影者欄に、MediaWikiの
 * 定型句が混ざっていたものを整える(cleanAuthorNameに同じパターンを追加済み)。
 * "No machine-readable author provided. Crown of Lenten rose assumed (based on copyright claims)."
 * → "Crown of Lenten rose"
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FROM = "No machine-readable author provided. Crown of Lenten rose assumed (based on copyright claims).";
const TO = "Crown of Lenten rose";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'ca4cf898%'`);
  const itinId = rows[0].id;
  const photo = await prisma.photo.findFirst({ where: { spot: { name: "蔵王ロープウェイ", day: { itineraryId: itinId } } } });
  if (!photo) throw new Error("写真が見つかりません");
  if (photo.author !== FROM) throw new Error("撮影者の文言が想定外です: " + photo.author);
  console.log("確認OK。", photo.id);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.photo.update({ where: { id: photo.id }, data: { author: TO } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
