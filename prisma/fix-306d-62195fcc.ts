/**
 * チェックリスト #306 の修正記録(企画運営2点)。
 * しおり「富士山を一望、大石公園と河口湖の定番絶景スポット日帰りプラン」
 * (62195fcc-88cc-4287-81fd-4c43b73a86a6)
 *
 * 1. 新倉山浅間公園の398段の階段に、足元の安全の一文を追加。
 * 2. 北口本宮冨士浅間神社の「木造の鳥居として日本最大級です」→
 *    「日本最大級とされます」にヘッジ。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-306d-62195fcc.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "62195fcc-88cc-4287-81fd-4c43b73a86a6";

async function main() {
  const arakura = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "新倉山浅間公園" },
  });
  const oldStep = "展望デッキまでは398段の階段を上りますが、";
  const newStep = "展望デッキまでは398段の階段を上ります。急な階段が続くので、足元に気をつけて上りましょう。";
  if (arakura.memo?.includes(oldStep)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: arakura.id }, {
      memo: arakura.memo.replace(oldStep, newStep),
    });
  }

  const kitaguchi = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "北口本宮冨士浅間神社" },
  });
  const oldTorii = "木造の鳥居として日本最大級です。";
  const newTorii = "木造の鳥居として日本最大級とされます。";
  if (kitaguchi.memo?.includes(oldTorii)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kitaguchi.id }, {
      memo: kitaguchi.memo.replace(oldTorii, newTorii),
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
