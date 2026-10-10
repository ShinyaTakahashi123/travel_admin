/**
 * #317の続き(自己チェックの気づき2)。
 * 飛瀧神社の「車で帰路につきましょう」が、決まり3の帰りの一言チェック
 * (「帰り」等のキーワード)に引っかからなかった(「帰路」は対象外、
 * #312と同じ事象)。「帰り」を含む表現に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317c-74506e1f.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "飛瀧神社(那智の滝)" },
  });
  const old = "見学を終えたら、車で帰路につきましょう。";
  const next = "見学を終えたら、車で帰りましょう。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
