/**
 * チェックリスト #306 の修正記録(ふだんの見直し)。
 * しおり「富士山を一望、大石公園と河口湖の定番絶景スポット日帰りプラン」
 * (62195fcc-88cc-4287-81fd-4c43b73a86a6)
 *
 * 本番で3か所・09:30〜13:10のみで決まりに届いていなかった。さらに、
 * 久保田一竹美術館(12:55)と河口湖〜富士山パノラマロープウェイ(12:10)の
 * visitTimeが本文の順番(大石公園→美術館→ロープウェイ、本文の「続いては」
 * の記述で確認)と食い違っており、ロープウェイの方が先の時刻になっていた
 * (データの誤り)。正しい順序で時刻を再計算した。
 *
 * 富士吉田・忍野の実在の観光地を3件追加。
 * 1. 新倉山浅間公園(way 765997878): 富士山と五重塔(忠霊塔、昭和38年
 *    [1963]建立)を望む絶景スポット、398段の階段。
 *    出典(直接開いたURL): https://fujiyoshida.net/spot/12(富士吉田市
 *    観光ガイド公式)
 * 2. 忍野八海(node 4717364293): 富士山の伏流水が湧く8つの湧水池群、
 *    平成25年(2013)世界文化遺産登録(富士山の構成資産)。
 *    出典: https://www.vill.oshino.lg.jp/page/1168.html(忍野村公式)
 * 3. 新屋山神社(node 4125177905): 天文3年(1534)創建と伝わる神社、近年は
 *    金運の神社として知られる(日本三大金運神社の一つともいわれ、の形で
 *    ヘッジ)。
 *
 * 座標はすべてNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-306-62195fcc.ts
 * (実行済み。新倉山浅間公園の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "62195fcc-88cc-4287-81fd-4c43b73a86a6";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "新倉山浅間公園")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const oishi = spots.find((s) => s.name === "大石公園")!;
  const kubota = spots.find((s) => s.name === "久保田一竹美術館")!;
  const ropeway = spots.find((s) => s.name === "河口湖〜富士山パノラマロープウェイ")!;

  const oishiMemo =
    "河口湖の北岸に広がる大石公園は、湖の向こうに富士山を望む、河口湖でも指折りの撮影スポットとして知られています。湖畔に沿って続く「花街道」では、初夏にはラベンダー、秋にはコキアなど、季節ごとに表情を変える花々が楽しめ、富士山と湖、そして花という三つの景色が一度に楽しめるのがこの公園の魅力です。園内には売店を兼ねた「河口湖自然生活館」もあるので、散策の合間に立ち寄ってみましょう。風のない日には、湖面に富士山が映り込む姿が見られることもあります。";

  const kubotaMemo =
    "大石公園からは車で15分ほどです。久保田一竹美術館は、染色作家・久保田一竹が、室町時代に生まれた染色技法「辻が花」に独自の工夫を重ね、「一竹辻が花」として確立した作品を展示する美術館で、1990年代に開館しました。久保田一竹はその功績によりフランス芸術文化勲章も受章しています。見どころは作品だけでなく建物そのものにもあり、太い柱を組み上げたピラミッド状の本館と、なだらかな曲線を描く新館が並び立つ様子は見応えがあります。新館は南の島の石灰岩を積み上げた外観から、スペインの建築家ガウディの作品を思わせるとも評されています。庭園には琉球の石灰岩や富士山の溶岩が配され、館内から眺める庭越しの富士山も見どころのひとつです。作品と建築、庭園と、三拍子そろった空間をゆっくりとご覧ください。";

  const ropewayMemo =
    "久保田一竹美術館からは車で15分ほどです。河口湖〜富士山パノラマロープウェイは、麓の駅からゴンドラに乗れば、あっという間に天上山の山頂駅に到着します。この場所はかつて「カチカチ山ロープウェイ」とも呼ばれ、天上山を舞台にしたとされる昔話「かちかち山」にちなんだ名前と伝えられており、山頂駅の周辺には、物語に登場するたぬきとうさぎのモニュメントも置かれています。山頂の展望台からは、富士山と河口湖を一枚の絵のように見渡すことができ、空気が澄んだ日には南アルプスまで遠く望めるといわれています。点検などで運休する日があるので、お出かけ前に確かめましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: oishi.id, data: { memo: oishiMemo } },
        {
          id: kubota.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 35)),
            transitMode: "car",
            transitDurationMin: 15,
            memo: kubotaMemo,
          },
        },
        {
          id: ropeway.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 40)),
            transitMode: "car",
            transitDurationMin: 15,
            memo: ropewayMemo,
          },
        },
        {
          create: {
            name: "新倉山浅間公園",
            address: "山梨県富士吉田市新倉3353",
            lat: 35.5004871,
            lng: 138.80082,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 50)),
            stayDurationMin: 60,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "河口湖〜富士山パノラマロープウェイからは車で10分ほどです。新倉山浅間公園は、富士山と五重塔を一枚の絵のように望める、絶景スポットとして知られています。展望デッキまでは398段の階段を上りますが、たどり着けば、富士吉田の街並みの向こうに、左右対称の富士山を一望できます。塔は正式には「忠霊塔」といい、昭和38年(1963)、太平洋戦争の戦没者を慰霊するために建てられました。公園の麓に鎮座する新倉富士浅間神社は、社伝によれば西暦705年ごろの創建と伝わり、平安時代の富士山の噴火の際には、朝廷から鎮火祭のための勅使が遣わされたとも伝えられています。周辺には食事処もあるので、ここで昼食をとりましょう。",
          },
        },
        {
          create: {
            name: "忍野八海",
            address: "山梨県南都留郡忍野村忍草",
            lat: 35.4602407,
            lng: 138.8327032,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 5)),
            stayDurationMin: 90,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "新倉山浅間公園からは車で15分ほどです。忍野八海は、富士山の伏流水が湧き出す、8か所の湧水池群です。かつてこの地にあった忍野湖が干上がって盆地になったあと、富士山や周辺の山々からの伏流水が、湧水として地表に姿を現したものと考えられています。平成25年(2013)、「富士山-信仰の対象と芸術の源泉」の構成資産の一部として、世界文化遺産に登録されました。富士登拝を行った道者たちが、この水で身を清めたと伝えられ、それぞれの池には八大竜王が祀られています。池をめぐりながら、富士山の恵みである清らかな湧水を感じてみましょう。",
          },
        },
        {
          create: {
            name: "新屋山神社",
            address: "山梨県富士吉田市新屋1-1",
            lat: 35.466838,
            lng: 138.797335,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 57)),
            stayDurationMin: 45,
            transitMode: "car",
            transitDurationMin: 12,
            memo:
              "忍野八海からは車で12分ほどです。新屋山神社は、天文3年(1534)の創建と伝わる、富士山麓に鎮座する神社です。大山祇命・天照皇大神・木花開耶姫命を祭神とし、古くから山を守る神、林業や農業に携わる人々の信仰を集めてきました。近年は、ある経営コンサルタントの「お金に困りたくなければこの神社に参拝するとよい」という言葉をきっかけに、金運の神社として知られるようになり、日本三大金運神社の一つともいわれています。山中にはさらに山頂近くの奥宮もありますが、この本宮でも十分にご利益にあずかれると伝えられています。静かに、敬意をもってお参りください。見学を終えたら、車で河口湖・富士吉田方面へ戻りましょう。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "河口湖畔の花公園・大石公園、久保田一竹美術館、天上山ロープウェイの富士山ビューに加えて、新倉山浅間公園の五重塔と富士山、世界遺産・忍野八海の湧水、新屋山神社まで。富士五湖・富士吉田エリアの富士山ビューと自然・歴史を一日で満喫するプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
