/**
 * #315の続き(自己チェックの気づき)。
 * fix-315で2点の見落とし:
 * 1. 大原美術館の書き出しの置き換え文に「ご案内するのは大原美術館です。」
 *    がそのまま残っていた(通常の文体になっていなかった)。
 * 2. 既存本文の「日本で最初の」「最初のエル・グレコの作品」が言い切り
 *    (決まり9)。ヘッジが無かったため直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315b-73c2a636.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大原美術館" },
  });
  let memo = s.memo ?? "";
  memo = memo.replace(
    "この旅は、歩いてめぐります。ご案内するのは大原美術館です。",
    "この旅は、歩いてめぐります。大原美術館は、"
  );
  memo = memo.replace("日本で最初の西洋美術中心の私立美術館です。", "日本で最初とされる西洋美術中心の私立美術館です。");
  memo = memo.replace(
    "日本にやってきた最初のエル・グレコの作品として知られています。",
    "日本にやってきた最初のエル・グレコの作品と伝わります。"
  );
  if (memo !== s.memo) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
