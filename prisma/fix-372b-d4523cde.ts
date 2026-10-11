/**
 * #372の続き。itinerary-audit.cjsの指摘に対応。
 * ①千葉神社に、元の「加曽利貝塚→千葉神社」の古いtransitLeg(car/20)が
 *   残ったままだった(千葉城からの新しい並びのtransitLegを設定し忘れ)。
 * ②きぼーる・千葉市美術館への移動が、徒歩の速さとして速すぎた(時速
 *   10km・8km相当)。実際の距離から、現実的な速さ(時速4.8km程度)で
 *   計算し直した。
 * これに伴い、以降のスポットの到着時刻も組み直した。動物公園の滞在を
 * 75分→60分に調整し、09:30〜16:50着地を保った。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-372b-d4523cde.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "305fcdd7-999d-4c5b-9e64-79445ec2bf41";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const jo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉城（千葉市立郷土博物館）" } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉神社" } });
  const kibo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "きぼーる" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉市美術館" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉駅で昼食" } });
  const zoo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉市動物公園" } });
  const kaizuka = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "加曽利貝塚" } });

  if (jinja.visitTime?.getUTCMinutes() === 33 || zoo.stayDurationMin === 60) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: jo.id, data: {} },
    {
      id: jinja.id,
      data: { visitTime: T(10, 33), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] } },
    },
    {
      id: kibo.id,
      data: { visitTime: T(11, 9), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] } },
    },
    {
      id: bijutsukan.id,
      data: { visitTime: T(12, 23), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] } },
    },
    { id: lunch.id, data: { visitTime: T(13, 26) } },
    { id: zoo.id, data: { visitTime: T(14, 38), stayDurationMin: 60 } },
    { id: kaizuka.id, data: { visitTime: T(15, 50) } },
  ]);

  console.log("#372続き: 千葉神社の古いtransitLegを修正、徒歩区間の速さを現実的な値に直し、到着時刻を組み直した(09:30〜16:50着地)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
