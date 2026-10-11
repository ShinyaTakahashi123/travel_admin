/**
 * #373の続き。itinerary-audit.cjs・prayer-check.cjsの指摘に対応。
 * ①美術館→持光寺の徒歩15分は、実際の距離(およそ300m)に対して遅すぎた
 *   (水増しに見える)ため8分に修正。以降のDay1の到着時刻も組み直した。
 * ②西郷寺→尾道渡船の徒歩8分は、実際の距離(およそ1.1km)に対して速すぎた
 *   ため18分に修正。渡船の到着時刻も組み直した。
 * ③千光寺・持光寺・西國寺・浄土寺・天寧寺・西郷寺に、敬意・配慮の一文が
 *   なかったため追加した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-373b-d4f3c053.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e708eacb-a5bc-45c4-8e50-b75d9b2ad14b";
const DAY2_ID = "d2670dc7-26f6-4415-b272-7d108d5f3a8e";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const senkoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千光寺" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "尾道市立美術館" } });
  const jikoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "持光寺" } });
  const lunch1 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "本通り商店街で昼食" } });
  const saikokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "西國寺" } });
  const jodoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "浄土寺" } });

  const tenneiji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "天寧寺" } });
  const nekohodo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "ネコの細道" } });
  const ushitora = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "艮神社" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "海岸通りで昼食" } });
  const saigoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "西郷寺" } });
  const tosen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "尾道渡船" } });

  if (jikoji.visitTime?.getUTCMinutes() === 43) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    {
      id: senkoji.id,
      data: {
        memo: senkoji.memo?.replace(
          "尾道水道を見下ろす眺めも楽しみながら、境内を巡りましょう。",
          "尾道水道を見下ろす眺めも楽しみながら、敬意をもって境内を巡りましょう。"
        ),
      },
    },
    { id: bijutsukan.id, data: {} },
    {
      id: jikoji.id,
      data: {
        visitTime: T(11, 43),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        memo: jikoji.memo?.replace(
          "坂の町らしい石段の参道を歩きながら、見学しましょう。",
          "坂の町らしい石段の参道を、敬意をもって歩きましょう。"
        ),
      },
    },
    { id: lunch1.id, data: { visitTime: T(12, 26) } },
    { id: saikokuji.id, data: { visitTime: T(14, 8), memo: saikokuji.memo?.replace(
        "急な石段を上りながら、広い境内を巡りましょう。",
        "急な石段を上りながら、敬意をもって境内を巡りましょう。"
      ) } },
    { id: jodoji.id, data: { visitTime: T(15, 33), memo: jodoji.memo?.replace(
        "見どころの多い境内をじっくりと巡りましょう。",
        "見どころの多い境内を、敬意をもってじっくりと巡りましょう。"
      ) } },
  ]);

  await setDaySpotOrder(DAY2_ID, [
    {
      id: tenneiji.id,
      data: {
        memo: tenneiji.memo?.replace(
          "坂の町らしい石段の参道を上りながら、見学しましょう。",
          "坂の町らしい石段の参道を、敬意をもって上りましょう。"
        ),
      },
    },
    { id: nekohodo.id, data: {} },
    { id: ushitora.id, data: {} },
    { id: lunch2.id, data: {} },
    {
      id: saigoji.id,
      data: {
        memo: saigoji.memo?.replace(
          "手を打って、鳴き龍の響きを聞いてみましょう。",
          "静かに手を合わせ、敬意をもって参拝しましょう。本堂の中央で手を打つと、天井に反響する鳴き龍の音も楽しめます。"
        ),
      },
    },
    { id: tosen.id, data: { visitTime: T(15, 54), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18 }] } } },
  ]);

  console.log("#373続き: 持光寺・尾道渡船の徒歩時間を実際の距離に合わせ修正、6スポットに敬意の一文を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
