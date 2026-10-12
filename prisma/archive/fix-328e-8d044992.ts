/**
 * #328の続き。法務2026-10-01 03:29の指摘: つなぎのずれ2件(自己チェック
 * の見落とし)。
 * 1) 表参道の結びが「続いては、歩いておよそ10分のキャットストリートへ
 *    向かいましょう。」のままだった→次は根津美術館のため「続いては、
 *    歩いておよそ18分の根津美術館へ向かいましょう。」に修正。
 * 2) 根津美術館の結びが「続いては、歩いておよそ15分のキャットストリート
 *    へ向かいましょう。」だったが、キャットストリートの書き出しは
 *    「根津美術館からは歩いておよそ30分です」→30分に揃えた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-328e-8d044992.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8d044992-9b50-48ea-9beb-05be5076a217";

async function main() {
  const omotesando = await prisma.spot.findFirstOrThrow({ where: { name: "表参道", day: { itineraryId: ITIN_ID } } });
  {
    const old = "続いては、歩いておよそ10分のキャットストリートへ向かいましょう。";
    const next = "続いては、歩いておよそ18分の根津美術館へ向かいましょう。";
    if (omotesando.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: omotesando.id }, { memo: omotesando.memo.replace(old, next) });
      console.log("omotesando updated");
    }
  }

  const nezu = await prisma.spot.findFirstOrThrow({ where: { name: "根津美術館", day: { itineraryId: ITIN_ID } } });
  {
    const old = "続いては、歩いておよそ15分のキャットストリートへ向かいましょう。";
    const next = "続いては、歩いておよそ30分のキャットストリートへ向かいましょう。";
    if (nezu.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: nezu.id }, { memo: nezu.memo.replace(old, next) });
      console.log("nezu updated");
    }
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
