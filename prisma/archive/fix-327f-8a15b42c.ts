/**
 * #327の続き。fix-327eでキツネ村を1日目の中ほどに動かした際、
 * 2つの本文の直し忘れがあった(itinerary-audit・flow-check再確認で
 * 発見、自己チェック)。
 * 1) 壽丸屋敷の書き出し「片倉家中武家屋敷からは車でおよそ10分です」
 *    は、実際の手段(walk)と食い違っていた→「歩いておよそ10分です」
 *    に修正。
 * 2) 傑山寺(1日目の最後のスポットになった)の結びが、まだキツネ村への
 *    案内文のままだった→宿の一言に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327f-8a15b42c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const sumaru = await prisma.spot.findFirstOrThrow({ where: { name: "壽丸屋敷", day: { itineraryId: ITIN_ID } } });
  {
    const old = "片倉家中武家屋敷からは車でおよそ10分です。";
    const next = "片倉家中武家屋敷からは歩いておよそ10分です。";
    if (sumaru.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: sumaru.id }, { memo: sumaru.memo.replace(old, next) });
      console.log("sumaru updated");
    }
  }

  const kessanji = await prisma.spot.findFirstOrThrow({ where: { name: "傑山寺", day: { itineraryId: ITIN_ID } } });
  {
    const old = "静かに、敬意をもってお参りください。続いては、車でおよそ20分のみやぎ蔵王キツネ村へ向かいましょう。";
    const next = "静かに、敬意をもってお参りください。今夜はこの近くの宿に泊まりましょう。";
    if (kessanji.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: kessanji.id }, { memo: kessanji.memo.replace(old, next) });
      console.log("kessanji updated");
    }
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
