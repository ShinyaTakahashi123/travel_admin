/**
 * チェックリスト #307 の修正記録(ふだんの見直し)。
 * しおり「高松城跡（玉藻公園）と讃岐うどん、海城と名物グルメのプラン」
 * (6333f4ce-9869-4542-910e-f9fdc7b89760)
 *
 * 本番で2か所・09:30〜12:00のみで、決まり(1日4か所以上・終了16:30〜
 * 17:00)に届いていないことが判明。高松市の実在の観光地を3件追加した。
 * ガイド口調も地の文に統一。
 *
 * 1. 屋島(屋島寺、node/info board 10600658539の周辺一帯): 源平合戦
 *    「屋島の戦い」(1185)の舞台、獅子の霊巌などの展望スポット。
 *    出典(直接開いたURL): https://www.my-kagawa.jp/feature/yashima/genpei
 *    (香川県公式観光サイト)
 * 2. 四国村ミウゼアム(way 468242591): 四国各地の古民家33棟を移築復原した
 *    野外博物館、安藤忠雄設計の四国村ギャラリー。
 *    出典: https://www.my-kagawa.jp/point/276/(香川県公式観光サイト)
 * 3. 北浜alley(way 797309861): 昭和初期建設の高松港の倉庫群を活用した
 *    商業施設、平成12年(2000)開業。
 *
 * 座標はNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-307-6333f4ce.ts
 * (実行済み。屋島の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "6333f4ce-9869-4542-910e-f9fdc7b89760";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "屋島")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const takamatsujo = spots.find((s) => s.name === "高松城跡（玉藻公園）")!;
  const shotengai = spots.find((s) => s.name === "高松中央商店街（讃岐うどん）")!;

  const takamatsujoMemo =
    "天正16年(1588)、豊臣秀吉の重臣・生駒親正によって築かれた城で、以来、生駒家4代、松平家11代にわたって歴代高松藩主の居城となりました。瀬戸内海の海水を堀に引き入れた、近世城郭としては最初にして最大級の海城で、愛媛県の今治城、大分県の中津城とともに「日本三大水城」に数えられています。堀には海の魚が泳ぎ、船で堀を巡る体験もできるなど、他の城には見られない独特の魅力を今に伝えています。天守は明治17年(1884)に老朽化のため取り壊されましたが、国の重要文化財に指定された艮櫓や月見櫓、水手御門などが今も残り、城跡は「玉藻公園」として整備されています。海水を湛えた堀を眺めながら、水城ならではの風情を楽しみましょう。";

  const shotengaiMemo =
    "高松城跡からは徒歩15分ほどです。高松中央商店街は、高松城の城下町として発展してきた商店街で、兵庫町、片原町、丸亀町、南新町など8つの商店街が連なり、アーケードの総延長はおよそ2.7kmと、日本でも有数の長さです。中心部にある「高松丸亀町壱番街」の広場では、高さおよそ32mのガラス張りのクリスタルドームが商店街のシンボルとして輝いています。この商店街には、讃岐うどんの名店も数多く軒を連ねており、コシの強い麺とだしの効いたつゆが自慢の本場の味を、気軽に味わうことができます。アーケードの下を歩きながら、讃岐うどんの食べ歩きで昼食にし、商店街散策を楽しみましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: takamatsujo.id, data: { memo: takamatsujoMemo } },
        { id: shotengai.id, data: { memo: shotengaiMemo } },
        {
          create: {
            name: "屋島",
            address: "香川県高松市屋島東町",
            lat: 34.3573289,
            lng: 134.1019348,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 15)),
            stayDurationMin: 90,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "高松中央商店街からは車で15分ほどです。屋島は、平安時代末期、元暦2年/寿永4年(1185)に源平合戦「屋島の戦い」の舞台となった、瀬戸内海に突き出た台地状の山です。那須与一が、平家方の船に掲げられた扇の的を見事に射抜いたという逸話でも知られています。山上の屋島寺は、天平勝宝6年(754)、鑑真によって開かれたと伝わる真言宗の寺院です。展望スポットの一つ「獅子の霊巌」からは、瀬戸内海と高松市街を一望でき、夕日の名所としても知られています。源平合戦の史跡をめぐりながら、瀬戸内海の絶景を楽しみましょう。静かに、敬意をもって見学しましょう。",
          },
        },
        {
          create: {
            name: "四国村ミウゼアム",
            address: "香川県高松市屋島中町91",
            lat: 34.3450912,
            lng: 134.1095986,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 53)),
            stayDurationMin: 90,
            transitMode: "car",
            transitDurationMin: 8,
            memo:
              "屋島からは車で8分ほどです。四国村ミウゼアムは、屋島の麓に広がる、四国各地の伝統的な古民家を移築復原した野外博物館です。およそ5万平方メートルの敷地に、河野家住宅や、牛が石臼を回して和三盆糖の原料を絞った円形の「砂糖しめ小屋」など、33棟の歴史的建造物が移築されており、国指定の文化財も含まれています。建築家・安藤忠雄が設計した「四国村ギャラリー」では、ピカソやボナールの絵画をはじめとする美術品も鑑賞できます。祖谷地方から移築した茅葺きの古民家を活用したうどん店「わら家」もあるので、四国の暮らしの歴史を感じながら散策を楽しみましょう。",
          },
        },
        {
          create: {
            name: "北浜alley",
            address: "香川県高松市北浜町4-14",
            lat: 34.3510069,
            lng: 134.0568173,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 38)),
            stayDurationMin: 55,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "四国村ミウゼアムからは車で15分ほどです。北浜alleyは、高松港のそばに立つ、昭和初期に建てられた倉庫群を活用した商業施設です。かつては高松港を経由する貨物の一時保管場所として使われていましたが、本州四国連絡橋の開通でその役割を終え、平成12年(2000)、カフェや雑貨店などが集まるおしゃれなスポットとして生まれ変わりました。レトロな倉庫の趣を残した建物の間を歩きながら、瀬戸内海を眺めるカフェで一休みするのもおすすめです。見学を終えたら、高松駅・高松港方面へ戻りましょう。",
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
        "瀬戸内海の海水を引き入れた高松城跡と、本場の讃岐うどん。栗林公園とは違う、高松の海城とグルメを楽しむプランです。源平合戦の舞台・屋島、四国の古民家を集めた四国村ミウゼアム、レトロな倉庫街・北浜alleyまで、高松市の定番と穴場を一日で巡ります。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
