/**
 * チェックリスト #311 の修正記録(法務の気づき、重複表現)。
 * しおり「群馬県立近代美術館と高崎城址、アートと歴史を楽しむ日帰り
 * プラン」(6de84372-3d1e-4106-bcb2-f881ee14b8b4)
 *
 * 高崎白衣大観音の本文末尾で、「静かに、敬意をもって〜」の配慮の一文が
 * 2回連続していたため、1つにまとめた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-311c-6de84372.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6de84372-3d1e-4106-bcb2-f881ee14b8b4";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "高崎白衣大観音(慈眼院)" },
  });
  const old =
    "静かに、敬意をもって見学しましょう。 戦没者を慰霊する観音像でもあります。静かに、敬意をもってお参りしましょう。";
  const next = "戦没者を慰霊する観音像でもあります。静かに、敬意をもってお参りしましょう。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
