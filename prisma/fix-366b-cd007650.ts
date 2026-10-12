/**
 * #366の続き。企画運営・法務(記録c2a2099)の指摘に対応。
 *
 * 企画運営:
 * 1. 博物館明治村の210分(決まりA)を150分に短縮し、本文に見る建物を明記
 *    (帝国ホテル中央玄関=フランク・ロイド・ライト設計、11棟が重要文化財)。
 * 2. 空いた時間に、犬山城のそばにある有楽苑(国宝茶室「如庵」、営業時間を
 *    公式で確認済み: 9:30〜17:00、水曜休)を追加。
 *
 * 法務:
 * ① 犬山城に、天守内の階段・最上階の廻縁への安全の一文を追加。
 * ② 犬山城下町で昼食に、今も人が暮らす町への配慮の一文を追加。
 * ③ 犬山城下町の座標が大字(犬山東古券)だけの点だったため、本町通り沿いの
 *    番地の点(犬山東古券72番地、35.381348,136.93988、推定)に修正。
 *
 * 新しい時刻(09:00〜16:30、6か所):
 * 犬山城(85)→針綱神社(20)→三光稲荷神社(28)→有楽苑(55)→犬山城下町・昼食(70)
 * →博物館明治村(150)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-366b-cd007650.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "fe97a028-dcf3-4711-99f9-9a5ed8cbea0a";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const inuyamajo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "犬山城" } });
  const sankou = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三光稲荷神社" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "犬山城下町で昼食" } });
  const meijimura = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "博物館明治村" } });

  if (meijimura.stayDurationMin === 150) {
    console.log("already applied, skipping");
    return;
  }

  const oldInuyamajoSafety = "木曽川と濃尾平野を見渡す天守からの眺めを楽しみましょう。";
  const newInuyamajoSafety =
    "木曽川と濃尾平野を見渡す天守からの眺めを楽しみましょう。天守内部の階段は急なため手すりにつかまり、最上階の廻縁(まわりえん)では身を乗り出さないようにしましょう。";

  const oldLunchLiving = "城下町らしい町並みを眺めながら、ゆっくりと食事を楽しみましょう。";
  const newLunchLiving =
    "城下町らしい町並みを眺めながら、ゆっくりと食事を楽しみましょう。今も人が暮らしている町なので、敷地には立ち入らず、静かに歩きましょう。";

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: inuyamajo.id,
        data: {
          memo: inuyamajo.memo?.includes(oldInuyamajoSafety)
            ? inuyamajo.memo.replace(oldInuyamajoSafety, newInuyamajoSafety)
            : inuyamajo.memo,
        },
      },
      { id: (await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "針綱神社" } })).id, data: {} },
      {
        id: sankou.id,
        data: {
          visitTime: T(10, 49),
          stayDurationMin: 28,
          memo: sankou.memo?.replace(
            "見学を終えたら、歩いて犬山城下町へ向かいましょう。",
            "見学を終えたら、歩いて有楽苑へ向かいましょう。"
          ),
        },
      },
      {
        create: {
          name: "有楽苑",
          address: "犬山市犬山御門先1",
          lat: 35.388007,
          lng: 136.9422273,
          visitTime: T(11, 22),
          stayDurationMin: 55,
          memo: "三光稲荷神社から歩いて5分ほど、次に訪れるのは有楽苑です。茶道の世界で名高い武将・織田有楽斎(織田長益)が建てたと伝えられる茶室「如庵」を中心とした日本庭園です。如庵は昭和11年(1936)に国宝に指定された、茶道文化史に残る貴重な建物で、昭和47年(1972)、庭園とあわせてこの地に移築されました。四季折々の植栽が彩る庭園を眺めながら、静かなひとときを過ごしましょう。見学を終えたら、歩いて犬山城下町へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: lunch.id,
        data: {
          lat: 35.381348,
          lng: 136.93988,
          visitTime: T(12, 30),
          memo: lunch.memo
            ?.replace(
              "三光稲荷神社から歩いて10分ほど、お昼は犬山城下町で食事をとりましょう。",
              "有楽苑から歩いて13分ほど、お昼は犬山城下町で食事をとりましょう。"
            )
            .replace(oldLunchLiving, newLunchLiving),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
        },
      },
      {
        id: meijimura.id,
        data: {
          visitTime: T(14, 0),
          stayDurationMin: 150,
          memo: "犬山城下町からバスで20分ほど、旅の最後に訪れるのは博物館明治村です。明治から昭和初期にかけての建物67棟を移築復原した、広大な野外博物館です。アメリカの建築家フランク・ロイド・ライトが設計した「帝国ホテル中央玄関」をはじめ、11棟が国の重要文化財に指定されています。蒸気機関車のSLや、京都市電に乗って園内を移動することもできます。帝国ホテル中央玄関を中心に、主な建物を見て回りましょう。見学を終えたら、バスで犬山駅へ戻り、犬山城下町を巡る1日を締めくくりましょう。",
        },
      },
    ]
  );

  console.log("#366続き: 有楽苑を追加、博物館明治村を150分に短縮、09:00〜16:30着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
