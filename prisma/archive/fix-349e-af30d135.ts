/**
 * #349の続き。itinerary-auditで「毎週」が料金・時刻・日程の記載として
 * 引っかかった。サンメッセ日南の定休日の一言を、具体的な曜日を書かない
 * 表現に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-349e-af30d135.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";

async function main() {
  const sunmesse = await prisma.spot.findFirstOrThrow({ where: { name: "サンメッセ日南", day: { itineraryId: ITIN_ID } } });

  const old = "定休日は毎週水曜日(祝日や特定期間は営業)のため、訪れる前に確かめましょう。";
  const next = "休園日が設けられているため、訪れる前に公式サイトなどで確かめましょう。";

  if (!sunmesse.memo?.includes(old)) {
    if (sunmesse.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: sunmesse.id }, { memo: sunmesse.memo.replace(old, next) });
  console.log("sunmesse closure-day wording generalized");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
