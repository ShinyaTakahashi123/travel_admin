/**
 * #373の続き。企画運営の4点指摘に対応。
 * 1. 決まりA: Day2の昼食110分は「食事のあと海岸通りをぶらぶら歩いて満喫」で
 *    延ばした時間合わせだったため、ぶらぶら歩く一文を外し65分に短縮。
 * 2. 尾道渡船55分(片道3分の船)も長すぎたため40分に短縮。向島側の
 *    「映画のロケセットが移築され、今も当時の小道具などが展示」は
 *    https://rurubu.jp/andmore/spot/80034509 (兼吉バス待合所、映画『あした』の
 *    ロケセット)で確認できたため、そのまま残した。
 * 1・2で空いた時間(合計95分)に、天寧寺とネコの細道の間へ宝土寺を1か所
 *    追加(OSM w8255588836...ではなくnode、"宝土寺"、34.408257,133.199319。
 *    #491と重ならないことを確認済み)。貞和年間(1345〜1349)開創、開山・融海の
 *    五輪塔、無尽窯の尾道焼展示などを38分で見学。
 *    出典: https://4travel.jp/dm_shisetsu/11293695
 * 3. ネコの細道の「優しく3回なでると願いが叶うとも伝えられています」を、
 *    願いが叶うという言い方にあたるため外した。
 * 4. つなぎの文: 1日目おのみち映画資料館→昼食、2日目御袖天満宮→昼食の
 *    「お昼の場所へ」を、次の書き出しに合わせて具体的な行き先名に直した。
 *    (あわせて、天寧寺→宝土寺の順になったため、天寧寺の結びの文も直した)
 *
 * 新しいDay2の時刻(09:30〜16:32、8か所):
 * 天寧寺(60)→宝土寺(38)→ネコの細道(35)→艮神社(35)→御袖天満宮(30)→
 * 昼食・海岸通り(65)→西郷寺(55)→尾道渡船(40)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-373g-d4f3c053.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e708eacb-a5bc-45c4-8e50-b75d9b2ad14b";
const DAY2_ID = "d2670dc7-26f6-4415-b272-7d108d5f3a8e";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const eiga = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "おのみち映画資料館" } });

  const tenneiji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "天寧寺" } });
  const nekohodo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "ネコの細道" } });
  const ushitora = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "艮神社" } });
  const goshoden = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "御袖天満宮" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "海岸通りで昼食" } });
  const saigoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "西郷寺" } });
  const tosen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "尾道渡船" } });

  const existingHodoji = await prisma.spot.findFirst({ where: { dayId: DAY2_ID, name: "宝土寺" } });
  if (existingHodoji) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: eiga.id },
    data: {
      memo: eiga.memo?.replace(
        "見学を終えたら、歩いてお昼の場所へ向かいましょう。",
        "見学を終えたら、歩いて本通り商店街へ向かいましょう。"
      ),
    },
  });

  await setDaySpotOrder(DAY2_ID, [
    {
      id: tenneiji.id,
      data: {
        memo: tenneiji.memo?.replace(
          "見学を終えたら、歩いてネコの細道へ向かいましょう。",
          "見学を終えたら、歩いて宝土寺へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "宝土寺",
        address: "尾道市東土堂町10-3",
        lat: 34.408257,
        lng: 133.199319,
        visitTime: T(10, 34),
        stayDurationMin: 38,
        memo: "天寧寺から歩いて4分ほど、次に訪れるのは宝土寺です。貞和年間(1345〜1349)、融海によって開かれたと伝えられる浄土宗の寺です。本堂前には、開山した融海の墓と伝わる古い五輪塔があります。境内の「無尽窯」では、尾道で焼かれた陶器が展示されており、春と秋には手づくりの品を集めた市も開かれます。静かに、敬意をもって境内を巡りましょう。見学を終えたら、歩いてネコの細道へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      id: nekohodo.id,
      data: {
        visitTime: T(11, 17),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        memo: nekohodo.memo
          ?.replace("天寧寺から歩いて2分ほど、次に訪れるのはネコの細道です。", "宝土寺から歩いて5分ほど、次に訪れるのはネコの細道です。")
          .replace(
            "路地には全部で108個の福石猫が点在し、優しく3回なでると願いが叶うとも伝えられています。",
            "路地には全部で108個の福石猫が点在しており、探しながら歩くのも楽しみの一つです。"
          ),
      },
    },
    { id: ushitora.id, data: { visitTime: T(11, 54) } },
    {
      id: goshoden.id,
      data: {
        visitTime: T(12, 35),
        memo: goshoden.memo?.replace(
          "見学を終えたら、歩いてお昼の場所へ向かいましょう。",
          "見学を終えたら、歩いて海岸通りへ向かいましょう。"
        ),
      },
    },
    {
      id: lunch2.id,
      data: {
        visitTime: T(13, 17),
        stayDurationMin: 65,
        memo: lunch2.memo?.replace(
          "行き交う船を眺めながら食事を楽しんだあとは、海岸通りをぶらぶらと歩いて、尾道水道の風景を満喫しましょう。見学を終えたら、歩いて西郷寺へ向かいましょう。",
          "行き交う船を眺めながら、ゆっくりと食事をとりましょう。お腹を満たしたら、歩いて西郷寺へ向かいましょう。"
        ),
      },
    },
    { id: saigoji.id, data: {} },
    { id: tosen.id, data: { stayDurationMin: 40 } },
  ]);

  console.log("#373続き: Day2に宝土寺を追加、昼食・渡船の時間を短縮し09:30〜16:32に組み直し。ネコの細道の文言とつなぎの文も修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
