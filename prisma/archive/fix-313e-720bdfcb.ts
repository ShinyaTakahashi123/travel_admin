/**
 * #313の続き(自己チェックの気づき)。
 * fix-313cの置換対象が、fix-313(最初の直し)で既に書き換わっていた古い
 * 文言のままだったため、一部が置換されずに残っていた(flow-check.cjsの
 * 書き出し表示で発覚)。現在の本文に対して直接置き換える。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313e-720bdfcb.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const uchiyama = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "有田内山伝統的建造物群" },
  });
  const oldUchiyama = "この旅は、車でめぐります。ご案内するのは、有田内山伝統的建造物群です。";
  const newUchiyama = "この旅は、内山地区は車を置いて歩き、そのあとは車でめぐります。ご案内するのは、有田内山伝統的建造物群です。";
  if (uchiyama.memo?.includes(oldUchiyama)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: uchiyama.id }, { memo: uchiyama.memo.replace(oldUchiyama, newUchiyama) });
  }

  const touzan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "陶山神社" },
  });
  let touzanMemo = touzan.memo ?? "";
  touzanMemo = touzanMemo.replace(
    "有田内山伝統的建造物群からは車でおよそ15分です。",
    "有田内山伝統的建造物群からは歩いておよそ5分です。"
  );
  touzanMemo = touzanMemo.replace(
    "続いては、車でおよそ5分の泉山磁石場へ向かいましょう。",
    "続いては、歩いておよそ15分の泉山磁石場へ向かいましょう。"
  );
  if (touzanMemo !== touzan.memo) {
    await updateSpotInItinerary(ITIN_ID, { spotId: touzan.id }, { memo: touzanMemo });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
