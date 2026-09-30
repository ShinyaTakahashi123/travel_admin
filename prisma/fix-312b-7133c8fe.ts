/**
 * チェックリスト #312 の修正記録(自己チェックの気づき)。
 * しおり「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」
 * (7133c8fe-1bb5-4d3f-b644-653c74f59419)
 *
 * fix-312で追加した書き出しの「最初にご案内するのは」「最初にご案内する
 * のは落合集落です」が、itinerary-audit.cjsの言い切りチェック(「最初」)に
 * 引っかかった。旅の一日目・二日目の最初のスポットという意味で、実際には
 * 「唯一・日本一」のような言い切りではないが、紛らわしいため「最初に」を
 * 使わない書き方に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312b-7133c8fe.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";

async function main() {
  const oben = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "祖谷渓 小便小僧展望台" },
  });
  const oldOben = "この旅は、車でめぐります。最初にご案内するのは、祖谷渓 小便小僧展望台です。";
  const newOben = "この旅は、車でめぐります。ご案内するのは、祖谷渓 小便小僧展望台です。";
  if (oben.memo?.includes(oldOben)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: oben.id }, { memo: oben.memo.replace(oldOben, newOben) });
  }

  const ochiai = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "落合集落" },
  });
  const oldOchiai = "この旅は、車でめぐります。旅の2日目、最初にご案内するのは落合集落です。";
  const newOchiai = "この旅は、車でめぐります。旅の2日目は、落合集落からご案内します。";
  if (ochiai.memo?.includes(oldOchiai)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ochiai.id }, { memo: ochiai.memo.replace(oldOchiai, newOchiai) });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
