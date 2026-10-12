/**
 * 写真がなくなったしおりの写真探し(docs/content/20261012-photo-fill.md)。
 * 1d72e477「サンメッセ日南のモアイ像、南国リゾートのフォトスポットプラン」は
 * 写真はあるが表紙(thumbnailUrl)が未設定だった。既存4枚(青島・道の駅フェニックス・
 * 鵜戸神宮・飫肥城下町、いずれも撮影者・ライセンス記録あり)のうち、「南国リゾート」
 * の主題に最も合う青島の空撮(松岡明芳、CC BY-SA 4.0)を表紙にする。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1d72e477%'`);
  const itinId = rows[0].id;
  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  if (itin!.thumbnailUrl) throw new Error("すでに表紙が設定されています: " + itin!.thumbnailUrl);

  const photo = await prisma.photo.findFirst({
    where: { spot: { name: "青島", day: { itineraryId: itinId } } },
  });
  if (!photo) throw new Error("青島の写真が見つかりません");

  console.log("確認OK。設定する表紙:", photo.url);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: photo.url } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
