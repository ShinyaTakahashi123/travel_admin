/**
 * #325の続き。企画運営2026-10-01 01:43の3点 + 法務2026-10-01 01:43の2点。
 *
 * 企画運営:
 * 1) たらい舟(小木港)の座標37.8092,138.2497は、宿根木から0.5kmしか
 *    離れておらず不正確だった。GSI住所検索で「新潟県佐渡市小木町」の
 *    点(37.819813,138.269623)に修正。力屋観光汽船(たらい舟の運営、
 *    佐渡市小木町1935、小木港より徒歩5分)の住所も確認したが、GSIは
 *    番地までは解決できなかったため、同じ小木町の代表点を採用した。
 *    宿根木集落の座標37.810921,138.24501はGSI・Nominatimの両方で
 *    一致しており正しい(修正後のたらい舟の点からは直線で約2.4km、
 *    「車で10分」の複数サイトの記載と整合する)。
 * 2) レンタカーの場所: 新潟港⇔両津港は通年運航だが、直江津⇔小木航路は
 *    季節運航(2026年は3/20〜11/23、佐渡汽船公式で確認)のため、本州
 *    からの玄関口は新潟港⇔両津港とし、たらい舟の冒頭に、両津港で
 *    レンタカーを借りる一言を追加。最後の妙宣寺の結びにも、両津港まで
 *    車でおよそ30分(複数サイトで確認)と明記した。
 * 3) 佐渡歴史伝説館の滞在95分は長すぎた(決まりA)。展示見学のみなら
 *    45〜60分が妥当と判断し55分に短縮。浮いた時間は、企画運営の提案
 *    どおり妙宣寺(新潟県内に現存する唯一の五重塔、国指定重要文化財、
 *    文政10年(1827)完成)を新しいスポットとして追加して埋めた。
 *    佐渡歴史伝説館→妙宣寺は車で約10分(5km)、ws-rentacar.comの
 *    モデルコースで確認。
 *
 * 法務:
 * - 宿根木集落: 「今も人が暮らす集落です。家の敷地に入ったり、住民の方を
 *   撮ったりせず、静かに歩きましょう。」を追加
 * - たらい舟: 「舟の上では船頭さんの案内に従い、揺れに気をつけましょう。」
 *   を追加
 *
 * 座標の出典(いずれも直接確認):
 * - たらい舟(小木港): GSI住所検索「新潟県佐渡市小木町」37.819813,138.269623
 * - 妙宣寺: ja.wikipedia.org「妙宣寺 (佐渡市)」インフォボックス
 *   37.971361,138.372500
 *
 * 事実確認(いずれも直接開いて確認):
 * - niigata-nippo.co.jp: 直江津⇔小木航路は季節運航(2026年3/20〜11/23)
 * - ws-rentacar.com/course/1144/: 佐渡歴史伝説館→妙宣寺は車で約10分(5km)
 * - ja.wikipedia.org「妙宣寺 (佐渡市)」: 日蓮の弟子・阿仏房日得が自邸を
 *   寺としたのが始まり。五重塔は文政10年(1827)完成、国の重要文化財、
 *   日光東照宮の五重塔を手本にしたと伝わる、現存する新潟県内唯一の
 *   五重塔とされる
 * - 複数サイト(WebSearch): 両津港⇔妙宣寺は車でおよそ30分
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-325b-881f9752.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "881f9752-bf82-464c-b6b7-0ff8e038f904";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "妙宣寺" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const tarai = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "たらい舟（小木港）" } });
  const yado = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "宿根木集落" } });
  const gold = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐渡西三川ゴールドパーク" } });
  const toki = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "トキの森公園" } });
  const rekishi = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐渡歴史伝説館" } });

  const taraiMemo =
    "佐渡へは、新潟港から両津港までカーフェリーやジェットフォイルで渡ります。両津港でレンタカーを借りて、南の小木エリアまで足を延ばしましょう。小木港のたらい舟は、佐渡島南部の小木半島に伝わる、伝統的な小舟です。洗濯桶を改良してつくられたのが始まりと伝えられています。享和2年(1802)の小木地震によって、この一帯の海岸が1メートル以上も隆起し、入り組んだ岩礁地帯が生まれたことで、大きな舟では入り込めない磯へも小回りよく進める、この独特な舟が考え出されたのだそうです。もともとはアワビやサザエ、海藻を採る「磯ねぎ漁」の道具として使われてきましたが、今では女性の船頭が巧みに操る観光名物として、多くの人に親しまれています。舟の上では船頭さんの案内に従い、揺れに気をつけましょう。円形の舟ならではの揺れを感じながら、小木の入り江の透き通った海を眺めてみましょう。続いては、車でおよそ10分の宿根木集落へ向かいましょう。";

  const yadoMemo =
    "たらい舟からは車でおよそ10分です。宿根木は、中世から港として栄え、江戸後期から明治初期にかけては、北前船に関わる船大工や廻船業で発展した集落です。小さな入り江に面して、船板などを利用した板壁の民家がおよそ100棟も密集し、「石置木羽葺屋根」と呼ばれる宿根木独自の屋根を持つ家々が、細い路地の両側に立ち並びます。集落のシンボルとされる「三角家」は、狭い路地の形に合わせて建てられた、舟の形をした独特の建物です。今も人が暮らす集落です。家の敷地に入ったり、住民の方を撮ったりせず、静かに歩きましょう。石畳の小径を歩きながら、船大工の町ならではの歴史ある町並みを眺めてみましょう。続いては、車でおよそ20分の佐渡西三川ゴールドパークへ向かいましょう。";

  const rekishiMemo =
    "トキの森公園からは車でおよそ34分です。佐渡歴史伝説館は、佐渡に流された順徳天皇・日蓮・世阿弥ら歴史上の人物や、島に伝わる伝説を、等身大のロボットを使って紹介する体感型のミュージアムです。昭和48年(1973)の開館以来、佐渡が古くから流刑の地であった歴史を、8つの場面に分けて分かりやすく伝えています。能楽を大成した世阿弥も、晩年をこの佐渡で過ごしたと伝えられており、館内には能舞台も設けられています。冬季は営業時間が異なることがあるため、出かける前に公式サイトで確かめておきましょう。佐渡に流された人々がどのような思いでこの島で過ごしたのか、思いをはせてみましょう。続いては、車でおよそ10分の妙宣寺へ向かいましょう。";

  await setDaySpotOrder(day1.id, [
    {
      id: tarai.id,
      data: { memo: taraiMemo, lat: 37.819813, lng: 138.269623 },
    },
    { id: yado.id, data: { memo: yadoMemo } },
    { id: gold.id, data: {} },
    { id: toki.id, data: {} },
    { id: rekishi.id, data: { memo: rekishiMemo, stayDurationMin: 55 } },
    {
      create: {
        name: "妙宣寺",
        address: "佐渡市阿仏坊29",
        lat: 37.971361,
        lng: 138.3725,
        visitTime: new Date(Date.UTC(1970, 0, 1, 16, 4)),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 10,
        memo:
          "佐渡歴史伝説館からは車でおよそ10分です。妙宣寺は、日蓮の弟子・阿仏房日得が、みずからの屋敷を寺としたのが始まりと伝えられる、佐渡における日蓮宗の中心寺院のひとつです。境内にそびえる五重塔は、文政10年(1827)に完成したもので、日光東照宮の五重塔を手本にしたと伝えられ、現存する新潟県内唯一の五重塔とされています。静かに、敬意をもって境内を歩いてみましょう。見学を終えたら、レンタカーで両津港まで戻りましょう(車でおよそ30分)。",
      },
    },
  ]);

  for (const [name, mode, min] of [
    ["妙宣寺", "car", 10],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
