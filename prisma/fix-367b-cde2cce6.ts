/**
 * #367の続き。itinerary-audit.cjsが白山神社(80分)・新潟市美術館(90分)に
 * 滞在時間の注意(⚠滞在)を出したため、決まりAに沿って見直す。
 *
 * - 白山神社: 80分→55分(大きな境内の総鎮守だが、この旅の他の神社と比べて
 *   長すぎたため短縮)
 * - 新潟市美術館: 90分→75分(短縮)
 * - 浮いた時間(40分)は、場所で過ごせる内容がある先に配分:
 *   新潟県政記念館 35→40分、りゅーとぴあ 35→40分、本町市場で昼食 70→100分
 *   (食事+市場の散策で、過ごす場所として実際に長くとれる)
 * - 1日の合計時間・終了時刻(16:35)は変えず、各スポットの到着時刻だけ
 *   組み直す
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-367b-cde2cce6.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "93e13569-6bfe-4462-8f6e-3cbff8bb17e5";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const hakusanjinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山神社" } });
  if (hakusanjinja.stayDurationMin === 55) {
    console.log("already applied, skipping");
    return;
  }
  const hakusanpark = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山公園" } });
  const kenseikinenkan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "新潟県政記念館" } });
  const ryutopia = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "りゅーとぴあ" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "本町市場で昼食" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "新潟市美術館" } });
  const minatoinari = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "湊稲荷神社" } });

  await setDaySpotOrder(DAY1_ID, [
    { id: hakusanjinja.id, data: { visitTime: T(9, 0), stayDurationMin: 55 } },
    { id: hakusanpark.id, data: { visitTime: T(9, 59), stayDurationMin: 55 } },
    { id: kenseikinenkan.id, data: { visitTime: T(10, 56), stayDurationMin: 40 } },
    { id: ryutopia.id, data: { visitTime: T(11, 38), stayDurationMin: 40 } },
    { id: lunch.id, data: { visitTime: T(12, 30), stayDurationMin: 100 } },
    { id: bijutsukan.id, data: { visitTime: T(14, 24), stayDurationMin: 75 } },
    { id: minatoinari.id, data: { visitTime: T(15, 55), stayDurationMin: 40 } },
  ]);

  console.log("#367続き: 白山神社55分・新潟市美術館75分に短縮、浮いた時間を県政記念館・りゅーとぴあ・本町市場昼食に配分、09:00〜16:35着地は維持");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
