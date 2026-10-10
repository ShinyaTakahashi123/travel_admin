/**
 * #323 桜島フェリーと湯之平展望所、活火山・桜島を間近に望むプラン
 * (81e2778b)。チェックリスト: 2か所09:30〜11:10で4か所未満・終了。
 *
 * 既存2スポットの過剰な丁寧語(「皆様」「ご案内するのは」「お楽しみください」
 * 「お楽しみいただけたことでしょう」)をサイト標準の口調に直し、実在スポット
 * 4つを追加: 月讀神社(桜島港近くの古社)・桜島ビジターセンター(火山学習
 * 施設)・桜島溶岩なぎさ公園(足湯)・有村溶岩展望所(溶岩原の遊歩道)。
 *
 * 座標の出典:
 * - 月讀神社: Nominatim名称一致。way 1413440647, 31.5912326,130.5999732
 * - 桜島ビジターセンター: Nominatim名称一致。way 119454687,
 *   31.5908244,130.5941859
 * - 桜島溶岩なぎさ公園: Overpassが繰り返しタイムアウトしたため、GSI住所
 *   検索(鹿児島市桜島横山町1722-3、公式住所の町丁目までは一致、番地の
 *   解像度なし)。31.584061,130.595276
 * - 有村溶岩展望所: Nominatim名称一致。node 4879787921,
 *   31.5543093,130.6791137
 *
 * 事実確認:
 * - 24時間運航の終了(令和7年10月): city.kagoshima.lg.jp公式・複数報道で
 *   確認済み(既存本文どおり、事実として正確)
 * - 月讀神社: 和銅年間創建、大正噴火で埋没、昭和15年(1940)に現在地へ移設、
 *   コノハナサクヤヒメを合祀(sakurajima.gr.jp等)
 * - 桜島ビジターセンター: 火山学習施設、展望フロアあり(sakurajima.gr.jp等)
 * - 溶岩なぎさ公園・足湯: 全長約100m、日本最大級ともいわれる足湯、
 *   地下1000mから湧く赤褐色のナトリウム泉、9:00〜日没・入場無料
 *   (welcomekyushu.jp等公式)。料金には触れない
 * - 有村溶岩展望所: 大正溶岩原に整備、約1kmの遊歩道(sakurajima.gr.jp等)
 *
 * 移動時間の出典:
 * - なぎさ公園⇔湯之平展望所: サクラジマアイランドビュー周遊バス(30分
 *   間隔・1周55分)を利用、待ち時間を含めおよそ35分と概算
 * - 湯之平展望所⇔有村溶岩展望所: 港からバスで20分(公式)を参考に、
 *   展望所間はおよそ25分と概算
 * - 有村溶岩展望所⇔桜島港: バスでおよそ20分(公式)。桜島港⇔鹿児島港の
 *   フェリーはおよそ15分(既存本文の値)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-323-81e2778b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const ferry = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "桜島フェリー" } });
  const yunohira = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "湯之平展望所" } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "有村溶岩展望所" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const ferryMemo =
    "桜島フェリーは、鹿児島市街と桜島を結ぶ、およそ15分の船旅を楽しめるフェリーです。昭和59年(1984)から令和7年(2025)まで、実に41年にわたり、フェリーとしては全国で唯一となる24時間運航を続けてきました。深夜から早朝にかけての便は、令和7年(2025)10月に取りやめられましたが、命に関わる事態が起きた際に消防や警察の緊急車両を運べるよう、今もフェリーと船員が24時間体制で待機しています。デッキに出れば、錦江湾に浮かぶ桜島の雄大な姿や、行き交う船の様子を間近に眺めることができ、鹿児島の海の玄関口ならではの開放的な船旅を味わえます。桜島の噴煙をデッキから、爽快な船上のひとときとともに眺めてみましょう。続いては、歩いておよそ3分の月讀神社へ向かいましょう。";

  const yunohiraMemo =
    "溶岩なぎさ公園からは、桜島港周辺のバス停まで歩き、サクラジマアイランドビュー(周遊バス)でおよそ35分です。湯之平展望所は、桜島の北岳4合目、標高およそ373mに位置する、桜島の中で一般に開放されている展望所としては最も高い場所にあります。眼前には、今も噴煙を上げ続ける南岳の荒々しい山肌が間近に迫り、眼下には錦江湾と鹿児島市街の景色が広がります。北には霧島連山、南には薩摩富士とも呼ばれる開聞岳を望むことができ、桜島を中心とした錦江湾一帯の雄大なパノラマを、360度にわたって楽しむことができます。売店も併設されており、桜島ならではのお土産を選ぶこともできます。噴火の状況によって立ち入りが規制されることもあるため、出かける前に気象庁や鹿児島市の最新の情報を確かめておきましょう。フェリーから眺めた桜島の姿とはまた違う、火口に近い展望所ならではの活火山の迫力を感じてみましょう。続いては、バスでおよそ25分の有村溶岩展望所へ向かいましょう。";

  await setDaySpotOrder(day1.id, [
    { id: ferry.id, data: { memo: ferryMemo } },
    {
      create: {
        name: "月讀神社",
        address: "鹿児島市桜島横山町",
        lat: 31.5912326,
        lng: 130.5999732,
        visitTime: new Date(Date.UTC(1970, 0, 1, 9, 53)),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 3,
        memo:
          "桜島フェリーからは歩いておよそ3分です。月讀神社は、和銅年間(708〜715)の創建と伝わる、桜島港近くに鎮座する古社です。大正3年(1914)の大噴火で一度は溶岩の下に埋もれましたが、昭和15年(1940)、現在の場所に移されました。「桜島」の名の由来ともされる、コノハナサクヤヒメもあわせて祀られています。静かに、敬意をもってお参りください。続いては、歩いておよそ7分の桜島ビジターセンターへ向かいましょう。",
      },
    },
    {
      create: {
        name: "桜島ビジターセンター",
        address: "鹿児島市桜島横山町",
        lat: 31.5908244,
        lng: 130.5941859,
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 25)),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 7,
        memo:
          "月讀神社からは歩いておよそ7分です。桜島ビジターセンターは、桜島の噴火の歴史や、火山としての成り立ちを分かりやすく紹介する施設です。大型スクリーンでの映像上映や、火山灰・溶岩の標本展示などを通じて、今も活動を続ける桜島の姿を学ぶことができます。展望フロアからは、南岳の噴煙を間近に眺めることもできます。桜島の自然に、じっくりとふれてみましょう。続いては、歩いておよそ10分の溶岩なぎさ公園へ向かいましょう。",
      },
    },
    {
      create: {
        name: "溶岩なぎさ公園",
        address: "鹿児島市桜島横山町1722-3",
        lat: 31.584061,
        lng: 130.595276,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 25)),
        stayDurationMin: 70,
        transitMode: "walk",
        transitDurationMin: 10,
        memo:
          "桜島ビジターセンターからは歩いておよそ10分です。到着したら、まずこのあたりで昼食をとりましょう。桜島溶岩なぎさ公園は、大正大噴火の溶岩原に沿って整備された海辺の公園です。園内にはおよそ100mにおよぶ、日本最大級ともいわれる足湯があり、地下1000mから湧く赤褐色のナトリウム泉に足をひたしながら、錦江湾越しに鹿児島市街を望むことができます。タオルを忘れた場合は、近くの施設で買うこともできます。潮風を感じながら、足湯でひと休みしてみましょう。続いては、バスで湯之平展望所へ向かいましょう。",
      },
    },
    {
      id: yunohira.id,
      data: { memo: yunohiraMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 10)), stayDurationMin: 80 },
    },
    {
      create: {
        name: "有村溶岩展望所",
        address: "鹿児島市有村町",
        lat: 31.5543093,
        lng: 130.6791137,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 55)),
        stayDurationMin: 90,
        transitMode: "bus",
        transitDurationMin: 25,
        memo:
          "湯之平展望所からは、バスでおよそ25分です。有村溶岩展望所は、南岳の麓、大正大噴火の溶岩原に整備された展望所です。クロマツなどが根を張る溶岩地帯の中に、およそ1kmの遊歩道が整備されており、間近に迫る南岳の山肌や、荒々しい溶岩の姿を歩きながら眺めることができます。足元は溶岩でできた岩場のため、歩きやすい靴で、天候にも気をつけて歩きましょう。活火山ならではの荒々しい景観を、じっくりと味わってみましょう。見学を終えたら、バスで桜島港まで戻り(およそ20分)、フェリーで鹿児島市街へ戻りましょう(およそ15分)。",
      },
    },
  ]);

  for (const [name, mode, min] of [
    ["月讀神社", "walk", 3],
    ["桜島ビジターセンター", "walk", 7],
    ["溶岩なぎさ公園", "walk", 10],
    ["湯之平展望所", "bus", 35],
    ["有村溶岩展望所", "bus", 25],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }

  const newDescription =
    "錦江湾を渡る桜島フェリーと、桜島港近くの月讀神社・ビジターセンター、足湯でくつろぐ溶岩なぎさ公園、一般開放エリアで最も火口に近い湯之平展望所、溶岩原を歩く有村溶岩展望所まで。仙巌園とは違う、今なお噴煙を上げる活火山を間近に望むプランです。";
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
