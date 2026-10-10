/**
 * #317の続き(自己チェックの気づき)。
 * fix-317で以下を見落としていた:
 * 1. 青岸渡寺・飛瀧神社のvisitTimeが、那智大社の滞在延長前の古い計算の
 *    まま(13:13・14:25)残っており、時刻が合わなくなっていた
 *    (itinerary-audit.cjsで検出)。正しい時刻(14:43・15:25)に修正。
 * 2. 那智大社の「本宮、速玉と巡ってきた熊野三山めぐりの締めくくりに」
 *    が、那智大社が最後のスポットでなくなった(青岸渡寺・飛瀧神社が
 *    続く)のに残っていた(flow-check.cjsの「途中に結び」で検出)。
 *    通常の案内文に差し替え。
 * 3. Day1に昼食の一言が無かった。熊野本宮大社(12:20〜13:40、決まりの
 *    窓内)に追加。
 * 4. つぼ湯が最後のスポットになったが、宿の一言が無かった(元は大斎原に
 *    あったが、つぼ湯へ差し替えた際に移し忘れていた)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317b-74506e1f.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  const seigantoji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "青岸渡寺" },
  });
  if (seigantoji.visitTime?.getUTCHours() === 13 && seigantoji.visitTime?.getUTCMinutes() === 13) {
    await updateSpotInItinerary(ITIN_ID, { spotId: seigantoji.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 43)),
    });
  }

  const hirou = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "飛瀧神社(那智の滝)" },
  });
  if (hirou.visitTime?.getUTCHours() === 14 && hirou.visitTime?.getUTCMinutes() === 25) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hirou.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 25)),
    });
  }

  const nachi = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "熊野那智大社" },
  });
  const nachiMemo = (nachi.memo ?? "").replace(
    "本宮、速玉と巡ってきた熊野三山めぐりの締めくくりに、この聖地で静かに、敬意をもってお参りください。",
    "本宮、速玉と巡ってきたこの聖地で、静かに、敬意をもってお参りください。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: nachi.id }, { memo: nachiMemo });

  const hongu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "熊野本宮大社" },
  });
  const honguMemo = (hongu.memo ?? "").replace(
    "今日から2日間かけて、熊野三山のすべてを巡っていきます。境内では静かに、敬意をもってお参りください。",
    "今日から2日間かけて、熊野三山のすべてを巡っていきます。境内では静かに、敬意をもってお参りください。参拝のあとは、このあたりで昼食をとりましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: hongu.id }, { memo: honguMemo });

  const tsuboyu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "湯の峰温泉 つぼ湯" },
  });
  const tsuboyuMemo = (tsuboyu.memo ?? "") + " 今夜はこの近くの宿にご宿泊いただきます。";
  await updateSpotInItinerary(ITIN_ID, { spotId: tsuboyu.id }, { memo: tsuboyuMemo });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
