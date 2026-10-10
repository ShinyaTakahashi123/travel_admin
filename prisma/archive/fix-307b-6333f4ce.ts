/**
 * チェックリスト #307 の修正記録(セルフチェックで発見)。
 * しおり「高松城跡（玉藻公園）と讃岐うどん、海城と名物グルメのプラン」
 * (6333f4ce-9869-4542-910e-f9fdc7b89760)
 *
 * itinerary-audit.cjsで、本番に元からあった2点を発見。
 * 1. 高松城跡の「日本三大水城に数えられています」が言い切り(決まり9)。
 *    「ともいわれています」にヘッジ。
 * 2. 高松城跡(10:30終了)→高松中央商店街(11:00開始、移動15分)の間に、
 *    説明のつかない15分の空白があった。移動時間どおりに補正(後続スポット
 *    もカスケード)。この結果、1日の終了が16:18となり決まり2にわずかに
 *    届かなくなったため、北浜alleyの滞在を55→70分に見直した(建物3棟の
 *    倉庫街を歩いてめぐる、実在する範囲での妥当な延長)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-307b-6333f4ce.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6333f4ce-9869-4542-910e-f9fdc7b89760";

async function main() {
  const takamatsujo = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "高松城跡（玉藻公園）" },
  });
  const oldText = "「日本三大水城」に数えられています。";
  const newText = "「日本三大水城」ともいわれています。";
  if (takamatsujo.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: takamatsujo.id }, {
      memo: takamatsujo.memo.replace(oldText, newText),
    });
  }

  const shotengai = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "高松中央商店街（讃岐うどん）" },
  });
  if (shotengai.visitTime?.getUTCHours() === 11 && shotengai.visitTime?.getUTCMinutes() === 0) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shotengai.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 45)),
    });

    // 後続スポットのvisitTimeを-15分でカスケード
    const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
    const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
    let cursor: Date | null = null;
    for (const s of ordered) {
      if (s.name === "高松中央商店街（讃岐うどん）") {
        cursor = new Date(new Date(Date.UTC(1970, 0, 1, 10, 45)).getTime() + s.stayDurationMin! * 60000);
        continue;
      }
      if (cursor == null) continue;
      const base: Date = cursor;
      const start: Date = new Date(base.getTime() + (s.transitDurationMin ?? 0) * 60000);
      if (s.visitTime?.getTime() !== start.getTime()) {
        await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: start });
      }
      cursor = new Date(start.getTime() + (s.stayDurationMin ?? 0) * 60000);
    }
  }

  const kitahama = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "北浜alley" },
  });
  if (kitahama.stayDurationMin === 55) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kitahama.id }, { stayDurationMin: 70 });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
