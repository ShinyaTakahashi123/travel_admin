/**
 * 写真がなくなったしおりの写真探し。法務の指摘: c4f58fdd(田沢湖)の「たつこ像」に
 * 付けた写真(File:Lake_Tazawa_and_Kansa-gū_20210213.jpg)は、実際には漢槎宮
 * (浮木神社、御座石神社の境内社)と湖の写真で、たつこ像は写っていなかった。
 * 同じしおりに「御座石神社」のスポットがあるため、そちらへ付け替える。
 * あわせて撮影者の表記を「(Tea-making tea) 掬茶」→「掬茶」に統一する
 * (ほかのしおりの掬茶さんの写真と同じ書き方にする指摘)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;

  const tatsuko = await prisma.spot.findFirst({ where: { name: "たつこ像", day: { itineraryId: itinId } } });
  const gozaishi = await prisma.spot.findFirst({ where: { name: "御座石神社", day: { itineraryId: itinId } }, include: { photos: true } });
  if (!tatsuko || !gozaishi) throw new Error("スポットが見つかりません");
  if (gozaishi.photos.length > 0) throw new Error("御座石神社にはすでに写真があります");

  const photo = await prisma.photo.findFirst({ where: { spotId: tatsuko.id } });
  if (!photo) throw new Error("たつこ像の写真が見つかりません");
  if (photo.author !== "(Tea-making tea) 掬茶") throw new Error("撮影者の文言が想定外です: " + photo.author);

  console.log("確認OK。付け替え元:", photo.id, "→ 御座石神社", gozaishi.id);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.photo.update({
    where: { id: photo.id },
    data: { spotId: gozaishi.id, caption: "御座石神社(漢槎宮)", author: "掬茶" },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
