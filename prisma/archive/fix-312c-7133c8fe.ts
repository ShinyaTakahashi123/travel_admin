/**
 * チェックリスト #312 の修正記録(自己チェックの気づき2)。
 * しおり「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」
 * (7133c8fe-1bb5-4d3f-b644-653c74f59419)
 *
 * flow-check.cjsで、つづき商店(古式そば打ち体験塾)の末尾「車で帰路に
 * つきましょう」が、決まり3の帰りの一言チェック(「帰り」「駅へ」等の
 * キーワード)に引っかからなかった(「帰路」は対象外)。「帰り」を含む
 * 表現に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312c-7133c8fe.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "つづき商店(古式そば打ち体験塾)" },
  });
  const old = "体験を終えたら、車で帰路につきましょう。";
  const next = "体験を終えたら、車で帰りましょう。";
  if (s.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
