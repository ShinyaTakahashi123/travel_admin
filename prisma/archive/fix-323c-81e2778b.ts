/**
 * #323の続き。企画運営2026-10-01 00:49の4点。
 * 1) 終わりが16:25で窓(16:30〜17:00)外だった。
 * 2) 湯之平展望所80分・有村溶岩展望所90分は長すぎた(決まりA)。
 * 3) サクラジマアイランドビュー(周遊バス)は有村溶岩展望所まで行かない。
 *    実際に確かめたところ、有村溶岩展望所への最寄りバス停「溶岩展望所前」
 *    は、周遊バスとは別の鹿児島交通バス(垂水港行き)で、桜島港発が
 *    07:20・08:50・11:20・13:50・16:40発などごく少ない本数だった
 *    (jorudan/pianotohikouki.com調べ)。往復の接続が難しいため、有村
 *    溶岩展望所は取りやめ、周遊バスの停留所である烏島展望所・赤水展望広場
 *    に差し替えた(企画運営の提案どおり)。あわせて桜島自然恐竜公園も追加。
 * 4) 昼食(溶岩なぎさ公園)の開始が11:25で11:30の少し前だった。前の区間を
 *    調整し、11:30以降に始まるようにした。
 *
 * 周遊バスの実際の停留所順(桜島港→火の島めぐみ館→レインボー桜島→
 * ビジターセンター→烏島展望所→赤水展望広場→(国際砂防センター、毎時30分
 * 発便のみ)→赤水湯之平口→湯之平展望所→桜洲小学校前→桜島港、1周
 * 約55分・30分間隔、出典: kotsu-city-kagoshima.jp公式)を踏まえ、各停留所
 * 間の移動は、乗車時間に加えて次発までの待ち時間も含めて、およそ25分ずつ
 * と概算した(30分間隔の実際の運行を踏まえた現実的な見積もり)。
 *
 * 座標の出典:
 * - 桜島自然恐竜公園: Nominatim名称一致。way 173478022,
 *   31.5931099,130.6021259
 * - 烏島展望所: Nominatim名称一致。node 592924257,
 *   31.5817752,130.6011495
 * - 赤水展望広場: Nominatim名称一致。way 1412963821,
 *   31.5768524,130.6030966
 *
 * 事実確認:
 * - 桜島自然恐竜公園: 桜島港から徒歩10分、実物大の恐竜モデルや大型遊具、
 *   入園無料(sakurajima.gr.jp等公式)。料金には触れない
 * - 烏島展望所: 大正溶岩原の高台、もとは沖合500mの独立した島だったが
 *   大正噴火の溶岩で陸続きに(sakurajima.gr.jp等)
 * - 赤水展望広場: 錦江湾や桜島を望む広場(kagoshima-yokanavi.jp等)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-323c-81e2778b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "桜島自然恐竜公園" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const ferry = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "桜島フェリー" } });
  const tsukiyomi = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "月讀神社" } });
  const visitorCenter = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "桜島ビジターセンター" } });
  const nagisa = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "溶岩なぎさ公園" } });
  const yunohira = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "湯之平展望所" } });

  const ferryMemo = (ferry.memo ?? "").replace(
    "続いては、歩いておよそ3分の月讀神社へ向かいましょう。",
    "続いては、歩いておよそ3分の桜島自然恐竜公園へ向かいましょう。"
  );

  const tsukiyomiMemo = (tsukiyomi.memo ?? "").replace(
    "桜島フェリーからは歩いておよそ3分です。",
    "桜島自然恐竜公園からは歩いておよそ4分です。"
  );

  const yunohiraMemo =
    "赤水展望広場からは、バスでおよそ25分です。湯之平展望所は、桜島の北岳4合目、標高およそ373mに位置する、桜島の中で一般に開放されている展望所としては最も高い場所とされています。眼前には、今も噴煙を上げ続ける南岳の荒々しい山肌が間近に迫り、眼下には錦江湾と鹿児島市街の景色が広がります。北には霧島連山、南には薩摩富士とも呼ばれる開聞岳を望むことができ、桜島を中心とした錦江湾一帯の雄大なパノラマを、360度にわたって楽しむことができます。売店も併設されており、桜島ならではのお土産を選ぶこともできます。噴火の状況によって立ち入りが規制されることもあるため、出かける前に気象庁や鹿児島市の最新の情報を確かめておきましょう。フェリーから眺めた桜島の姿とはまた違う、火口に近い展望所ならではの活火山の迫力を感じてみましょう。見学を終えたら、バスで桜島港まで戻り(およそ25分)、フェリーで鹿児島市街へ戻りましょう(およそ15分)。";

  await setDaySpotOrder(
    day1.id,
    [
      { id: ferry.id, data: { memo: ferryMemo } },
      {
        create: {
          name: "桜島自然恐竜公園",
          address: "鹿児島市桜島横山町79",
          lat: 31.5931099,
          lng: 130.6021259,
          visitTime: new Date(Date.UTC(1970, 0, 1, 9, 53)),
          stayDurationMin: 30,
          transitMode: "walk",
          transitDurationMin: 3,
          memo:
            "桜島フェリーからは歩いておよそ3分です。桜島自然恐竜公園は、実物大の恐竜モデルがいくつも置かれた、緑豊かな公園です。高さ12mを超える大型のすべり台や、アスレチック遊具もあり、家族連れにも親しまれています。フェリー乗り場からもほど近く、桜島観光の合間に立ち寄りやすい場所です。恐竜たちが出迎える園内を、ひと足伸ばして歩いてみましょう。続いては、歩いておよそ4分の月讀神社へ向かいましょう。",
        },
      },
      { id: tsukiyomi.id, data: { memo: tsukiyomiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 27)), transitDurationMin: 4 } },
      { id: visitorCenter.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 0)), stayDurationMin: 60 } },
      {
        id: nagisa.id,
        data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 10)), stayDurationMin: 65 },
      },
      {
        create: {
          name: "烏島展望所",
          address: "鹿児島市桜島横山町",
          lat: 31.5817752,
          lng: 130.6011495,
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 40)),
          stayDurationMin: 40,
          transitMode: "bus",
          transitDurationMin: 25,
          memo:
            "溶岩なぎさ公園からは、桜島港周辺のバス停まで歩き、サクラジマアイランドビュー(周遊バス)でおよそ25分です。烏島展望所は、大正大噴火の溶岩原にある高台の展望所です。かつては沖合およそ500mに浮かぶ、烏島という独立した島でしたが、大正3年(1914)の噴火による膨大な溶岩流に飲み込まれ、陸続きになりました。眼下に広がる溶岩原と錦江湾、桜島の姿を眺めながら、噴火の記憶をたどってみましょう。続いては、バスでおよそ25分の赤水展望広場へ向かいましょう。",
        },
      },
      {
        create: {
          name: "赤水展望広場",
          address: "鹿児島市桜島横山町",
          lat: 31.5768524,
          lng: 130.6030966,
          visitTime: new Date(Date.UTC(1970, 0, 1, 14, 45)),
          stayDurationMin: 40,
          transitMode: "bus",
          transitDurationMin: 25,
          memo:
            "烏島展望所からは、バスでおよそ25分です。赤水展望広場は、錦江湾と桜島の雄大な姿を望むことができる、開けた広場です。周遊バスの停留所も兼ねており、休憩スポットとしても利用されています。潮風を感じながら、ここまで歩いてきた桜島の景色をあらためて眺め、ひと休みしましょう。続いては、バスでおよそ25分の湯之平展望所へ向かいましょう。",
        },
      },
      {
        id: yunohira.id,
        data: {
          memo: yunohiraMemo,
          visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)),
          stayDurationMin: 40,
          transitMode: "bus",
          transitDurationMin: 25,
        },
      },
    ],
    { remove: ["4de6d19d-dcc0-418d-a44b-964d8e074266"] }
  );

  for (const [name, mode, min] of [
    ["月讀神社", "walk", 4],
    ["桜島ビジターセンター", "walk", 7],
    ["溶岩なぎさ公園", "walk", 10],
    ["烏島展望所", "bus", 25],
    ["赤水展望広場", "bus", 25],
    ["湯之平展望所", "bus", 25],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const newDescription =
    "錦江湾を渡る桜島フェリーと、桜島港近くの恐竜公園・月讀神社・ビジターセンター、足湯でくつろぐ溶岩なぎさ公園、烏島展望所や赤水展望広場、一般開放エリアで最も火口に近いとされる湯之平展望所まで。仙巌園とは違う、今なお噴煙を上げる活火山を間近に望むプランです。";
  if (itin.description !== newDescription) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDescription } });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
