/**
 * #313の続き(自己チェックの気づき)。
 * fix-313で陶山神社の書き出し・締めの一言を直した際、visitTimeの更新を
 * 忘れていた(旧11:30のまま)。itinerary-audit.cjsが「時刻の計算が合わ
 * ない」を検出したため、11:15に修正(有田内山伝統的建造物群09:30+90分
 * →11:00、+移動15分→11:15)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313b-720bdfcb.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const touzan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "陶山神社" },
  });
  if (touzan.visitTime?.getUTCHours() === 11 && touzan.visitTime?.getUTCMinutes() === 30) {
    await updateSpotInItinerary(ITIN_ID, { spotId: touzan.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 15)),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
