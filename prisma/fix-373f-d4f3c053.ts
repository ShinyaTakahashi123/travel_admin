/**
 * #373の続き。itinerary-audit.cjsの指摘に対応。法務の座標修正で美術館が
 * 千光寺に近づいたため、千光寺→美術館・美術館→持光寺の徒歩時間が実際の
 * 距離(およそ300m)に対して遅すぎた(水増しに見える)。逆に、映画資料館→
 * 昼食(本通り/尾道駅)は実際の距離(およそ1.2km)に対して徒歩5分は速すぎた。
 * 3区間を実際の距離に合わせて直し、以降の到着時刻も組み直した。
 * (おのみち映画資料館・艮神社の「位置が前とほぼ同じ」の注意は、実際に
 * 隣接する場所同士のため、事実どおりで対応不要と判断)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-373f-d4f3c053.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e708eacb-a5bc-45c4-8e50-b75d9b2ad14b";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const senkoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千光寺" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "尾道市立美術館" } });
  const jikoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "持光寺" } });
  const rekishi = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "おのみち歴史博物館" } });
  const eiga = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "おのみち映画資料館" } });
  const lunch1 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "本通り商店街で昼食" } });
  const saikokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "西國寺" } });
  const jodoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "浄土寺" } });

  if (bijutsukan.visitTime?.getUTCMinutes() === 52) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: senkoji.id, data: {} },
    {
      id: bijutsukan.id,
      data: {
        visitTime: T(9, 52),
        memo: bijutsukan.memo?.replace("千光寺から歩いて15分ほど", "千光寺から歩いて7分ほど"),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    },
    {
      id: jikoji.id,
      data: {
        visitTime: T(11, 5),
        memo: jikoji.memo?.replace("尾道市立美術館から歩いて15分ほど", "尾道市立美術館から歩いて8分ほど"),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
      },
    },
    { id: rekishi.id, data: { visitTime: T(11, 46) } },
    { id: eiga.id, data: { visitTime: T(12, 13) } },
    {
      id: lunch1.id,
      data: {
        visitTime: T(12, 54),
        memo: lunch1.memo?.replace("おのみち映画資料館から歩いて5分ほど", "おのみち映画資料館から歩いて16分ほど"),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
      },
    },
    { id: saikokuji.id, data: { visitTime: T(14, 16) } },
    { id: jodoji.id, data: { visitTime: T(15, 21), stayDurationMin: 69 } },
  ]);

  console.log("#373続き: 千光寺→美術館・美術館→持光寺・映画資料館→昼食の徒歩時間を実際の距離に合わせ修正(09:00〜16:30着地)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
