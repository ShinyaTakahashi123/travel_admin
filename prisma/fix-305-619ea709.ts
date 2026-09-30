/**
 * チェックリスト #305 の修正記録(ふだんの見直し)。
 * しおり「仙巌園と尚古集成館、世界遺産・薩摩の近代化遺産を巡るプラン」
 * (619ea709-6437-438a-8421-ce3ad8852486)
 *
 * 本番で2か所・09:30〜11:50のみで、決まり(1日4か所以上・終了16:30〜
 * 17:00)に届いていないことが判明。磯地区・鹿児島市街・桜島の実在の
 * 観光地を追加した。ガイド口調も地の文に統一。
 *
 * 1. 旧鹿児島紡績所技師館(異人館、way 302414182): 仙巌園・尚古集成館と
 *    同じ世界遺産の構成資産、慶応3年(1867)築の洋館。
 *    出典(直接開いたURL): https://www.city.kagoshima.lg.jp/kyoiku/kanri/bunkazai/shisetsu/kanko/048.html
 *    (鹿児島市公式)
 * 2. 城山展望台(node 589671404): 標高107m、西南戦争最後の激戦地。
 *    出典: https://www.kagoshima-yokanavi.jp/spot/10002(鹿児島市観光
 *    ナビ公式)
 * 3. 鹿児島市維新ふるさと館(way 117143629): 西郷隆盛・大久保利通らの
 *    生誕地・加治屋町にある歴史観光施設、2018年リニューアル。
 *    出典: https://www.city.kagoshima.lg.jp/kanshin/shisetsu/kanko/034.html
 *    (鹿児島市公式)
 * 4. 桜島溶岩なぎさ公園・足湯: 大正3年(1914)の大正噴火の溶岩上に整備、
 *    日本の遊歩百選。座標は桜島港(way 731860346、水域の中心点)を基準に、
 *    そこから徒歩5分の場所にある公園として記載(公式サイトの案内による)。
 *    出典: https://www.sakurajima.gr.jp/spot/4098.html(桜島観光ポータル)
 *
 * 座標はすべてNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-305-619ea709.ts
 * (実行済み。異人館の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "619ea709-6437-438a-8421-ce3ad8852486";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "旧鹿児島紡績所技師館(異人館)")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const senganen = spots.find((s) => s.name === "仙巌園")!;
  const shokoshuseikan = spots.find((s) => s.name === "尚古集成館")!;

  await updateSpotInItinerary(ITIN_ID, { spotId: senganen.id }, {
    memo:
      "万治元年(1658)、薩摩藩19代当主・島津光久によって築かれた、島津家の別邸庭園です。桜島と錦江湾を借景に取り入れた、およそ1万5千坪にもおよぶ雄大な庭園で、昭和33年(1958)には国の名勝に指定されました。園内には、28代当主・島津斉彬が、西洋の技術書をもとに大砲の鋳造のために築いたと伝えられる反射炉の跡も残されており、幕末、薩摩藩が進めた近代化事業の一端をうかがい知ることができます。平成27年(2015)には、仙巌園と、隣接する旧集成館の関連資産が、「明治日本の産業革命遺産」の構成資産として、ユネスコの世界文化遺産に登録されました。桜島を望む雄大な景色と、日本の近代化の原点となった歴史の両方を、味わいましょう。",
  });

  await updateSpotInItinerary(ITIN_ID, { spotId: shokoshuseikan.id }, {
    memo:
      "仙巌園からは徒歩10分ほどです。尚古集成館は、慶応元年(1865)に完成した、現存する日本最古の石造西洋式機械工場「旧集成館機械工場」の建物を利用した博物館で、島津家や、薩摩藩が進めた「集成館事業」の歴史と文化を紹介しています。嘉永4年(1851)、薩摩藩主となった島津斉彬は、隣接する敷地に反射炉の建設に着手し、最盛期にはおよそ1,200人もの職人が働く、造船・大砲製造・ガラス製造・紡績など多岐にわたる、大規模な近代工場群「集成館」を磯の地に築き上げました。大正12年(1923)、この機械工場の建物を活用し、斉彬の集成館事業を顕彰する博物館として尚古集成館が開館しました。国の重要文化財であり、世界文化遺産の構成資産でもあるこの建物で、日本の近代化の原点となった薩摩藩の先進的な取り組みを、じっくりと学んでみましょう。",
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: senganen.id, data: {} },
        { id: shokoshuseikan.id, data: {} },
        {
          create: {
            name: "旧鹿児島紡績所技師館(異人館)",
            address: "鹿児島市吉野町9685-15",
            lat: 31.6156378,
            lng: 130.5742006,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 45)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 4,
            memo:
              "尚古集成館からは徒歩4分ほどです。旧鹿児島紡績所技師館は、通称「異人館」と呼ばれる洋館です。慶応3年(1867)、日本初の洋式紡績工場・鹿児島紡績所の技術指導にあたった、イギリス人技師7名の宿舎として建てられました。コロニアル様式のベランダを持ちながら、日本の寸法で設計された、和洋折衷の様式が特徴で、日本で最も初期の洋風木造建築の代表例とされています。昭和37年(1962)、国の重要文化財に指定され、平成27年(2015)には世界文化遺産の構成資産にも登録されました。磯地区周辺には食事処もあるので、ここで昼食をとりましょう。",
          },
        },
        {
          create: {
            name: "城山展望台",
            address: "鹿児島市城山町22",
            lat: 31.5962647,
            lng: 130.5500869,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 27)),
            stayDurationMin: 45,
            transitMode: "car",
            transitDurationMin: 12,
            memo:
              "異人館からは車で12分ほどです。城山は、鹿児島市街地の中心部に位置する、標高107mの山です。明治10年(1877)の西南戦争では、最後の激戦地となり、周辺には西郷洞窟をはじめとする史跡が残っています。展望台からは、鹿児島市街地や錦江湾、桜島を一望でき、晴れた日には霧島や開聞岳まで見渡せます。樹齢およそ400年のクスの大木をはじめ600種以上の植物が自生する城山自然遊歩道は、昭和6年(1931)に天然記念物・国の史跡に指定されています。",
          },
        },
        {
          create: {
            name: "鹿児島市維新ふるさと館",
            address: "鹿児島市加治屋町23-1",
            lat: 31.5846261,
            lng: 130.5478502,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 20)),
            stayDurationMin: 90,
            transitMode: "car",
            transitDurationMin: 8,
            memo:
              "城山展望台からは車で8分ほどです。鹿児島市維新ふるさと館は、西郷隆盛や大久保利通ら、明治維新を支えた偉人たちが幼少期を過ごした甲突川沿いの加治屋町に立つ、歴史観光施設です。幕末の薩摩や明治維新の歴史を、展示や映像、ロボットを使ったドラマ仕立ての演出などで分かりやすく紹介しており、平成30年(2018)にリニューアルオープンしました。「維新のふるさと」と呼ばれるこの町で、日本の近代化を導いた薩摩の歴史を、じっくりと学んでみましょう。",
          },
        },
        {
          create: {
            name: "桜島溶岩なぎさ公園・足湯",
            address: "鹿児島市桜島横山町",
            lat: 31.5941455,
            lng: 130.5981968,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 20)),
            stayDurationMin: 70,
            transitMode: "other",
            transitDurationMin: 30,
            memo:
              "維新ふるさと館からは車で桜島フェリーターミナルへ向かい(8分ほど)、桜島フェリーで桜島港へ渡ります(15分ほど)。桜島溶岩なぎさ公園は、桜島港から徒歩5分ほどの海沿いにある公園です。大正3年(1914)の大正噴火で流出した溶岩の上に整備された、全長およそ3kmの「溶岩なぎさ遊歩道」の起点で、日本の遊歩百選にも選ばれています。公園内には、地下1000mから湧き出る天然温泉を利用した、全長およそ100mの足湯があり、錦江湾と桜島を眺めながら旅の疲れを癒やせます。桜島は今も活動を続ける火山です。火山灰の状況や立ち入りの規制は、気象庁や現地の最新の案内で確かめましょう。見学を終えたら、フェリーで鹿児島港へ戻りましょう。",
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
        "島津家の別邸庭園・仙巌園と、日本初の西洋式工場群を紹介する尚古集成館、異人館を巡る世界遺産の近代化遺産めぐりに、城山展望台・維新ふるさと館の鹿児島の歴史、桜島のフェリーと足湯まで。薩摩の近代化遺産と鹿児島の魅力を丸一日楽しむプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
