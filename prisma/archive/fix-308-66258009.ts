/**
 * チェックリスト #308 の修正記録(ふだんの見直し)。
 * しおり「湯布院フローラルヴィレッジ、絵本の世界を体感するプラン」
 * (66258009-2007-49b0-a1b5-fdb3131a4b15)
 *
 * 本番で1か所・09:30〜11:10のみで、決まり(1日4か所以上・終了16:30〜
 * 17:00)に届いていないことが判明。由布院温泉の実在の観光地4件を追加。
 * ガイド口調も地の文に統一。
 *
 * 1. 由布院駅(way 411437588): 建築家・磯崎新設計、平成2年(1990)竣工。
 *    出典(直接開いたURL): 複数の建築紹介記事で裏取り(磯崎新設計・1990年
 *    竣工・礼拝堂イメージ・吹き抜け高さ約12m)。
 * 2. 金鱗湖(way 162781794): 明治17年(1884)、毛利空桑が命名したと伝わる湖。
 *    出典: https://yufuin.gr.jp/spot/spot-1268/ (由布院・庄内・挾間公式
 *    旅ガイド)
 * 3. 宇奈岐日女神社(way 412349256): 社伝で景行天皇12年創祀、別称「六所宮」。
 *    出典(直接開いたURL): https://www.visit-oita.jp/spots/detail/4384
 *    (大分県公式観光サイト)
 * 4. 狭霧台(node 1746093077): 標高およそ680mの展望スポット、由布院と
 *    別府を結ぶ道沿い。
 *    出典(直接開いたURL): https://www.visit-oita.jp/spots/detail/4361
 *    (大分県公式観光サイト)
 *
 * 座標はNominatim(OSM)で確認。由布院駅→金鱗湖の徒歩時間は、直線距離では
 * なく、実際の観光ルート(湯の坪街道経由、公式情報で「徒歩約20分」)を
 * 採用。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-308-66258009.ts
 * (実行済み。由布院駅の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "66258009-2007-49b0-a1b5-fdb3131a4b15";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "由布院駅")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const village = spots.find((s) => s.name === "湯布院フローラルヴィレッジ")!;

  await updateSpotInItinerary(ITIN_ID, { spotId: village.id }, {
    memo:
      "イギリス・コッツウォルズ地方の街並みをモチーフにした、平成24年(2012)に開業したテーマパークです。石畳の小道沿いには、絵本から飛び出してきたような愛らしい洋風の建物が立ち並び、花々に彩られたイングリッシュガーデンの雰囲気を楽しめます。園内の「フクロウの森」には、さまざまな種類のフクロウが暮らし、間近で触れ合うこともできます。動物のふれあい施設には、人気の絵本に登場するキャラクターにちなんだ名前が付けられた子たちもおり、大人から子どもまで写真を撮りながら楽しめる仕掛けが随所にあります。由布岳を望む温泉地の中に忽然と現れる、絵本の世界のような異国情緒を、存分に楽しみましょう。",
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: village.id, data: {} },
        {
          create: {
            name: "由布院駅",
            address: "大分県由布市湯布院町川北8-2",
            lat: 33.2626128,
            lng: 131.3551264,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 25)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 15,
            memo:
              "湯布院フローラルヴィレッジからは徒歩15分ほどです。由布院駅は、プリツカー賞を受賞した建築家・磯崎新の設計で、平成2年(1990)に竣工した駅舎です。礼拝堂をイメージしたという駅舎は、建物全体が黒で統一された木造建築で、ロビーは高さおよそ12mの吹き抜けになっており、改札を通らずにそのままプラットホームへ抜けられるつくりが特徴です。駅前からは、観光辻馬車が発着しており、御者の案内でのんびりと町を巡ることもできます。駅前・由布見通り周辺には食事処もあるので、ここで昼食をとりましょう。",
          },
        },
        {
          create: {
            name: "金鱗湖",
            address: "大分県由布市湯布院町川上",
            lat: 33.2667196,
            lng: 131.3690386,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 55)),
            stayDurationMin: 90,
            transitMode: "walk",
            transitDurationMin: 30,
            memo:
              "由布院駅からは、湯の坪街道の土産物店や甘味処が並ぶ通りを歩いて20分ほどです。金鱗湖は、由布岳のふもとに広がる小さな湖です。もとは「岳下の池」と呼ばれていましたが、明治17年(1884)、学者・毛利空桑が、夕日に照らされて金色に輝く魚のうろこを見て「金鱗湖」と名付けたと伝えられています。湖畔には、茅葺き屋根が目印の共同浴場「下ん湯」があり、露天風呂に入りながら湖を眺めることもできます。冬の早朝には、湖面から立ちのぼる幻想的な朝霧を見られることもあります。湖の周りをのんびりと歩いて、由布院を代表する風景を楽しみましょう。",
          },
        },
        {
          create: {
            name: "宇奈岐日女神社",
            address: "大分県由布市湯布院町川上2220",
            lat: 33.2568585,
            lng: 131.3654926,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 33)),
            stayDurationMin: 60,
            transitMode: "car",
            transitDurationMin: 8,
            memo:
              "金鱗湖からは車で8分ほどです。宇奈岐日女神社は、社伝によれば景行天皇12年の創祀と伝わる神社です。かつて沼地だった由布院盆地で、人々が鰻(うなぎ)を沢沼の精霊として祀ったことが、社名の由来になったとも伝えられています。国常立尊をはじめとする6柱を祭神とすることから、「六所宮」とも呼ばれ、古くから地元の人々に親しまれてきました。境内には、観光辻馬車の停留所も置かれています。静かに、敬意をもってお参りください。",
          },
        },
        {
          create: {
            name: "狭霧台",
            address: "大分県由布市湯布院町川西",
            lat: 33.2602225,
            lng: 131.3824425,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 41)),
            stayDurationMin: 55,
            transitMode: "car",
            transitDurationMin: 8,
            memo:
              "宇奈岐日女神社からは車で8分ほどです。狭霧台は、由布院と別府を結ぶ道沿い、標高およそ680mに位置する展望スポットです。由布院盆地の町並みを一望でき、由布岳を望む四季折々の景色が楽しめます。名前の由来にもなった「狭霧」と呼ばれる幻想的な朝霧は、特に冬の早朝に見られることがあります。九州でも有数のドライブコースとして知られる道沿いにあり、駐車場も備えた休憩スポットです。見学を終えたら、車で別府・大分方面、または由布院温泉方面へ戻りましょう。",
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
        "イギリスの絵本のような街並みを再現した湯布院フローラルヴィレッジ。動物とのふれあいも楽しめる、フォトジェニックなプランです。磯崎新設計の由布院駅、由布院を代表する金鱗湖、宇奈岐日女神社、由布院盆地を一望する狭霧台まで、由布院温泉の定番と穴場を一日で巡ります。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
