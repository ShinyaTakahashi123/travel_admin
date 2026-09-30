/**
 * チェックリスト #292 の修正記録(見直し5、法務の指摘)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 蔵王地蔵尊の「建立後、遭難者が少なくなったことから、『災難よけ地蔵』と
 * 呼ばれるようになりました」は、ご利益を事実として言い切る形になっていた。
 * 公式サイトも言い伝えとして書いているため、「…といわれ、…なったそうです」
 * とぼかす形に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292m-44c030d6.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const jizo = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王地蔵尊" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: jizo.id } });
  if (row.memo?.includes("なりました。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jizo.id }, {
      memo: row.memo.replace(
        "建立後、遭難者が少なくなったことから、「災難よけ地蔵」と呼ばれるようになりました。",
        "建立後、遭難者が少なくなったといわれ、「災難よけ地蔵」と呼ばれるようになったそうです。"
      ),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
