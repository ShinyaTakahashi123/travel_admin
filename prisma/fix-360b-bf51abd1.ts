/**
 * #360の続き。企画運営の指摘2点に対応。
 * 1. 説明文「日本三大中華街の一つ、南京町で」の言い切りにヘッジを追加。
 * 2. メリケンパークの「瀬戸内海を行き交う船」→神戸港の前の海は大阪湾のため
 *    「港を行き交う船」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-360b-bf51abd1.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bf51abd1-ab87-4ed5-8f1e-4405ff855fa1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "日本三大中華街の一つ、南京町で";
  const newDesc = "日本三大中華街の一つとされる南京町で";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(oldDesc, newDesc) } });
    console.log("説明文: 「日本三大中華街」にヘッジを追加");
  } else {
    console.log("説明文: 既に対応済み");
  }

  const meriken = await prisma.spot.findFirstOrThrow({ where: { name: "メリケンパーク", day: { itineraryId: ITIN_ID } } });
  const oldSea = "瀬戸内海を行き交う船を眺めながら";
  const newSea = "港を行き交う船を眺めながら";
  if (meriken.memo?.includes(oldSea)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: meriken.id }, { memo: meriken.memo.replace(oldSea, newSea) });
    console.log("メリケンパーク: 「瀬戸内海」を「港」に修正");
  } else {
    console.log("メリケンパーク: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
