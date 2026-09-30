/**
 * #287の続き(法務の指摘、企画運営経由、2026-09-30 19:04 JST)。
 * 表紙(thumbnailUrl)がケーブルカーの写真のままで、ケーブルカーのスポットを
 * 外したため撮影者名が出せなくなっていた(cover-credit-check)。運休中の
 * 乗り物を表紙にするのも誤解のもとのため、現在のしおりにある実在のスポット
 * 「筑波山ロープウェイ」の写真(撮影者: Kiku-zou、CC BY-SA 3.0)に差し替え。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287k-3faebe45.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const photo = await prisma.photo.findFirstOrThrow({
    where: { spot: { day: { itineraryId: ITIN_ID }, name: "筑波山ロープウェイ" } },
  });
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: photo.url } });
  console.log("done, new thumbnailUrl:", photo.url);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
