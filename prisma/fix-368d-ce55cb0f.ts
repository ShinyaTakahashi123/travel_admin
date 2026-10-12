/**
 * #368の続き。法務の指摘3点に対応(記録6b468c9)。
 *
 * ① 三朝温泉散策: 河原の露天風呂が橋や道から見える場所のため、入浴者を
 *    撮影しないよう一文を追加。
 * ② 倉吉白壁土蔵群: 今も人が暮らす町なので、暮らしへの配慮の一文を追加。
 * ③ 座標を3か所修正:
 *    - 三佛寺: 度分秒換算の値からOSM実点(w669805309「三徳山三佛寺」、
 *      35.397794,133.958483)に修正
 *    - 三朝温泉で昼食: 案内板の点から、近くの「足湯」(n7308678686、
 *      35.411889,133.889481、推定)に修正
 *    - 倉吉白壁土蔵群: 名前のない道の点から、「赤瓦一号館」(n2993281966、
 *      35.432445,133.824164、推定)に修正
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-368d-ce55cb0f.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "ccb88c35-5eb7-4b59-ad40-9cb05a19cf7e";

async function main() {
  const sanbutsuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三徳山三佛寺（投入堂）" } });
  const misasa = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三朝温泉散策" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三朝温泉で昼食" } });
  const shirakabe = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "倉吉白壁土蔵群" } });
  const utsubuki = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "打吹公園" } });

  if (sanbutsuji.lat?.toString() === "35.397794") {
    console.log("already applied, skipping");
    return;
  }

  const photoOld = "すぐそばを流れる三徳川の河原には、川と一体になったような露天風呂も見られます。";
  const photoNew =
    "すぐそばを流れる三徳川の河原には、川と一体になったような露天風呂も見られます。入浴している人を撮影しないようにしましょう。";

  const livingOld = "玉川にかかる赤い石橋を渡りながら、昔ながらの町並みをゆっくりと歩きましょう。";
  const livingNew =
    "玉川にかかる赤い石橋を渡りながら、昔ながらの町並みをゆっくりと歩きましょう。今も人が暮らしている町なので、敷地には立ち入らず、静かに歩きましょう。";

  await setDaySpotOrder(DAY1_ID, [
    { id: sanbutsuji.id, data: { lat: 35.397794, lng: 133.958483 } },
    {
      id: misasa.id,
      data: { memo: misasa.memo?.includes(photoOld) ? misasa.memo.replace(photoOld, photoNew) : misasa.memo },
    },
    { id: lunch.id, data: { lat: 35.411889, lng: 133.889481 } },
    {
      id: shirakabe.id,
      data: {
        lat: 35.432445,
        lng: 133.824164,
        memo: shirakabe.memo?.includes(livingOld) ? shirakabe.memo.replace(livingOld, livingNew) : shirakabe.memo,
      },
    },
    { id: utsubuki.id, data: {} },
  ]);

  console.log("#368続き: 法務の指摘3点(写真の一文・暮らしの一文・座標3か所)に対応");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
