/**
 * 0582b3c4（嵐山の四季を感じる、庭園と古寺めぐり）#9
 * 宝厳院の削除（2026-10-30、法務・企画運営確認済み）
 *
 * 宝厳院は通常非公開・春秋の特別公開のみと判明（#19の見直しで発見）。seasonsが
 * しおり全体の設定のため、残すとこのしおり全体が夏・冬に出せなくなる。説明文に
 * 名前もないため削除。昼食は、もとの宝厳院メモにあった「天龍寺へ向かう参道沿いの
 * 湯豆腐店」の記述を、新設の「天龍寺の北門のあたり」(店ではない点=天龍寺北門node4277823455)
 * に移す。
 *
 * 竹林の道→天龍寺の直接の歩き(実測、昼食の点を経由)は2分+4分=6分で、もとの
 * 竹林の道→宝厳院(10分)→天龍寺(5分)の15分より9分短い。短くした滞在を戻す先が
 * ないため(決まり369の①は使えない)、1か所目(竹林の道)を11:16→11:45に遅らせる
 * (②、初日の上限)。これにより天龍寺13:36・嵐電嵐山駅14:53・嵐山公園15:46・
 * 出発16:41は、もとと1分も変えずに保たれる: 竹林の道11:45(60)→天龍寺の北門のあたり
 * (昼食)12:47(leg2,45)→天龍寺13:36(leg4,70)→嵐電嵐山駅14:53(45)→嵐山公園
 * 15:46(55、16:41出発)。入口の一文も11時半ごろ着に直す。説明文・全メモに
 * 「宝厳院」「獅子吼」の言い残しがないことを確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const DAY1 = "042a8bb0-cc40-43dc-b5a3-b42ef148cfd9";
const CHIKURIN = "48150c24-fe8a-49bc-8ab3-e40274ac7973";
const HOGONIN = "8eb00608-2818-4eb8-8183-4b32af776065"; // 削除
const TENRYUJI = "68f40941-dbb1-464a-9f23-c06effd06a5b";
const RANDEN = "0c425786-da71-4077-bb92-f5f6647a6591";
const ARASHIYAMA_KOEN = "0c474033-e873-4ca2-8614-89c0566eeca4";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const CHIKURIN_MEMO_OLD =
  "JR嵯峨嵐山駅に11時ごろ着いたら、歩いて約16分。嵯峨野めぐりのスタートは、青々とした竹が空を覆う約400mの道からです。ここに茂るのは、成長すると高さ25mにもなるというモウソウチク（孟宗竹）です。道の途中に建つ野宮神社は、伊勢神宮に仕える斎王が旅立つ前に身を清めた場所と伝えられ、『源氏物語』の「賢木」の巻にも描かれる由緒ある社。四季を通じて緑を保つ竹林は、桜や紅葉とはまた違う、一年中楽しめる嵯峨野らしい景色です。";
const CHIKURIN_MEMO_NEW =
  "JR嵯峨嵐山駅に11時半ごろ着いたら、歩いて約16分。嵯峨野めぐりのスタートは、青々とした竹が空を覆う約400mの道からです。ここに茂るのは、成長すると高さ25mにもなるというモウソウチク（孟宗竹）です。道の途中に建つ野宮神社は、伊勢神宮に仕える斎王が旅立つ前に身を清めた場所と伝えられ、『源氏物語』の「賢木」の巻にも描かれる由緒ある社。四季を通じて緑を保つ竹林は、桜や紅葉とはまた違う、一年中楽しめる嵯峨野らしい景色です。";

const SANDO_LUNCH_MEMO =
  "竹林の道から歩いて約2分。このあたりには食事のできる店があります。ここで昼食をとりましょう。";

const TENRYUJI_MEMO_OLD =
  "竹林を抜けた先にある、嵯峨野を代表する世界遺産の禅寺です。南北朝の争いで亡くなった後醍醐天皇の菩提を弔うため、足利尊氏が夢窓疎石を開山として建立したと伝えられ、造営費を補うために中国との貿易船「天龍寺船」を送り出した逸話も残ります。曹源池庭園は、夢窓疎石が手がけた池と石組みが700年近く創建当初の姿をとどめていると言われる名庭で、日本で初めて史跡・特別名勝に指定されたとされています。嵐山や亀山を借景に取り込み、池の向こうに広がる山並みまで一つの絵のように見えるよう計算されているのが見事です。静かに、敬意をもって拝観しましょう。次はレトロな嵐電嵐山駅へ、駅の足湯で少し休憩しましょう。";
const TENRYUJI_MEMO_NEW =
  "昼食のあと、参道を歩いて約4分。嵯峨野を代表する世界遺産の禅寺です。南北朝の争いで亡くなった後醍醐天皇の菩提を弔うため、足利尊氏が夢窓疎石を開山として建立したと伝えられ、造営費を補うために中国との貿易船「天龍寺船」を送り出した逸話も残ります。曹源池庭園は、夢窓疎石が手がけた池と石組みが700年近く創建当初の姿をとどめていると言われる名庭で、日本で初めて史跡・特別名勝に指定されたとされています。嵐山や亀山を借景に取り込み、池の向こうに広がる山並みまで一つの絵のように見えるよう計算されているのが見事です。静かに、敬意をもって拝観しましょう。次はレトロな嵐電嵐山駅へ、駅の足湯で少し休憩しましょう。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [CHIKURIN, TENRYUJI] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));
  if (byId.get(CHIKURIN)!.memo !== CHIKURIN_MEMO_OLD) throw new Error("竹林の道: memo現在値が期待と不一致");
  if (byId.get(TENRYUJI)!.memo !== TENRYUJI_MEMO_OLD) throw new Error("天龍寺: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log("竹林の道11:45(60)→天龍寺の北門のあたり(昼食)12:47(leg2,45)→天龍寺13:36(leg4,70)→嵐電嵐山駅14:53(45,変更なし)→嵐山公園15:46(55、16:41出発、変更なし)");
  console.log("入口: JR嵯峨嵐山駅11時半ごろ着→歩いて約16分→竹林の道11:45着");
  console.log("昼食の点: 天龍寺北門node4277823455(35.0171546,135.6722135)");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await setDaySpotOrder(
    DAY1,
    [
      { id: CHIKURIN, data: { visitTime: t(11, 45), memo: CHIKURIN_MEMO_NEW } },
      {
        create: {
          name: "天龍寺の北門のあたり",
          memo: SANDO_LUNCH_MEMO,
          lat: 35.0171546,
          lng: 135.6722135,
          visitTime: t(12, 47),
          stayDurationMin: 45,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        id: TENRYUJI,
        data: {
          visitTime: t(13, 36),
          memo: TENRYUJI_MEMO_NEW,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      { id: RANDEN, data: {} },
      { id: ARASHIYAMA_KOEN, data: {} },
    ],
    { remove: [HOGONIN] }
  );
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
