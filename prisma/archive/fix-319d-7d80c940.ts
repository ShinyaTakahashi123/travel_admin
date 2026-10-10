/**
 * #319の続き。企画運営2026-09-30 22:50の2点に対応。
 * 1) 鉄道博物館メモの「トレインレストラン日本食堂」という店名・食器の
 *    エピソードが実質的な店の紹介になっていたため、店名・メニュー・食器の
 *    話を外し、「館内には食事ができる場所もあるので、見学の途中で昼食を
 *    とりましょう。」という一般的な言い方に直した。
 * 2) タイトル「鉄道博物館で1日満喫」が、盆栽美術館・大宮公園・氷川神社も
 *    回る今の中身と合わなくなっていたため、「鉄道博物館と盆栽美術館、
 *    氷川神社をめぐる大宮の日帰りプラン」に変更(URLは変わらない)。
 *    説明文の「子どもから大人まで」は企画運営の指示どおり残した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-319d-7d80c940.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7d80c940-0507-41af-8688-ccb64b79a0a1";

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "鉄道博物館" },
  });
  const old =
    "見学の途中、館内の「トレインレストラン日本食堂」で昼食をとりましょう。寝台特急「北斗星」で実際に使われていた食器を使うなど、食堂車の雰囲気を味わえます。";
  const next = "館内には食事ができる場所もあるので、見学の途中で昼食をとりましょう。";
  if (museum.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: museum.memo.replace(old, next) });
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const newTitle = "鉄道博物館と盆栽美術館、氷川神社をめぐる大宮の日帰りプラン";
  if (itin.title !== newTitle) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: newTitle } });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
