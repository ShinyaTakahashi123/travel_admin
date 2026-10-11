/**
 * 企画運営の訂正: 1d72e477の表紙は、法務の確認で青島のままで問題なしとなった
 * (法務の決まりは「真上からの航空写真」を避けるもので、斜めからの空撮は
 * かまわない)。cover2で鵜戸神宮に差し替えたのを、青島に戻す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1d72e477%'`);
  const itinId = rows[0].id;

  const aoshima = await prisma.photo.findFirst({ where: { spot: { name: "青島", day: { itineraryId: itinId } } } });
  if (!aoshima) throw new Error("青島の写真が見つかりません");

  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  console.log("現在の表紙:", itin!.thumbnailUrl);
  console.log("戻す先:", aoshima.url);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: aoshima.url } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
