/**
 * #314の続き(自己チェックの気づき)。
 * fix-314で3点の見落とし:
 * 1. 佐嘉神社の書き出しが「佐賀県立博物館からは」のままだった(実際の
 *    直前は与賀神社)。作成時の書き間違い。
 * 2. 佐賀城本丸歴史館「本丸御殿の復元としては全国で初めて」が言い切り
 *    (決まり9)。既存の本文だが、ヘッジが無かったため直す。
 * 3. 佐賀バルーンミュージアム「日本で初めて有人飛行に成功した」も同様
 *    にヘッジ。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-314b-72a8b08e.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "72a8b08e-fc24-49ca-94da-b0faaabb2562";

async function main() {
  const sagajinja = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "佐嘉神社" },
  });
  const old1 = "佐賀県立博物館からは歩いておよそ10分です。";
  const next1 = "与賀神社からは歩いておよそ10分です。";
  if (sagajinja.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: sagajinja.id }, { memo: sagajinja.memo.replace(old1, next1) });
  }

  const rekishikan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "佐賀城本丸歴史館" },
  });
  const old2 = "本丸御殿の復元としては全国で初めて、";
  const next2 = "本丸御殿の復元としては全国で初めてとされ、";
  if (rekishikan.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: rekishikan.id }, { memo: rekishikan.memo.replace(old2, next2) });
  }

  const balloon = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "佐賀バルーンミュージアム" },
  });
  const old3 = "日本で初めて有人飛行に成功した熱気球「イカロス5号」の実機や、";
  const next3 = "日本で初めて有人飛行に成功したとされる熱気球「イカロス5号」の実機や、";
  if (balloon.memo?.includes(old3)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: balloon.id }, { memo: balloon.memo.replace(old3, next3) });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
