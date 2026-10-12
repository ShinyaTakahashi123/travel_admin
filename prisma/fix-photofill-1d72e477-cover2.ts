/**
 * 写真がなくなったしおりの写真探し。企画運営の指摘: 1d72e477の表紙に選んだ
 * 青島の写真はドローンの空撮(ファイル名にAerial photography/DJI/空撮とあり)で、
 * 法務の決まりで空からの写真は避けているため、同じしおりの別の写真(鵜戸神宮)に
 * 差し替える。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1d72e477%'`);
  const itinId = rows[0].id;

  const udo = await prisma.photo.findFirst({ where: { spot: { name: "鵜戸神宮", day: { itineraryId: itinId } } } });
  if (!udo) throw new Error("鵜戸神宮の写真が見つかりません");

  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  console.log("現在の表紙:", itin!.thumbnailUrl);
  console.log("差し替え先:", udo.url, "| author:", udo.author, "| license:", udo.license);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: udo.url } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
