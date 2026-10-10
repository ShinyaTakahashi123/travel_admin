/**
 * チェックリスト #302 の修正記録(セルフチェックで発見、決まり9)。
 * しおり「ひがし茶屋街と近江町市場、金沢の花街とグルメを楽しむプラン」
 * (58dbfab5-20c1-42b9-8315-8ad8f4afdf7c)
 *
 * 金沢21世紀美術館の「無料で入れる交流ゾーン」が決まり9(価格表現)に
 * 触れたため、「無料」を使わない表現に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-302b-58dbfab5.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "58dbfab5-20c1-42b9-8315-8ad8f4afdf7c";

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "金沢21世紀美術館" },
  });
  const oldText = "無料で入れる交流ゾーンには";
  const newText = "チケットがなくても入れる交流ゾーンには";
  if (museum.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, {
      memo: museum.memo.replace(oldText, newText),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
