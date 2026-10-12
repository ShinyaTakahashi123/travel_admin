/**
 * チェックリスト #302 の修正記録(ふだんの見直し)。
 * しおり「ひがし茶屋街と近江町市場、金沢の花街とグルメを楽しむプラン」
 * (58dbfab5-20c1-42b9-8315-8ad8f4afdf7c)
 *
 * 本番で2か所・09:30〜12:30のみで、決まり(1日4か所以上・終了16:30〜17:00)
 * に届いていないことが判明。近江町市場・ひがし茶屋街のあとに、金沢中心部の
 * 実在の観光地を4件追加した。
 *
 * 1. 兼六園(way 50288147, 36.5624267,140→136.6623546): 加賀藩主が造成した
 *    大名庭園、日本三名園の一つ・国の特別名勝。
 *    出典(直接開いたURL): https://www.kanazawa-kankoukyoukai.or.jp/spot/detail_10106.html
 *    (金沢旅物語=金沢市観光協会公式)
 * 2. 金沢城公園(way 128905245, 36.5657619,136.6594470): 加賀藩前田家の居城跡。
 *    菱櫓・五十間長屋・橋爪門続櫓(2001年復元)、石川門(重文)など。
 *    出典: https://www.kanazawa-kankoukyoukai.or.jp/spot/detail_10060.html(同上)
 * 3. 金沢21世紀美術館(way 197980653, 36.5608382,136.6582097): SANAA設計の
 *    円形美術館。無料の交流ゾーンに《スイミング・プール》など恒久展示。
 *    出典: https://www.kanazawa-kankoukyoukai.or.jp/spot/detail_10066.html(同上)
 * 4. 尾山神社(way 207744651, 36.5659713,136.6554788): 前田利家を祀る神社、
 *    明治8年(1875)築の和漢洋折衷の神門(国指定重要文化財)。
 *    出典: 金沢市公式(文化財保護課)
 *    https://www4.city.kanazawa.lg.jp/soshikikarasagasu/bunkazaihogoka/gyomuannai/3/1/1/bunkazai_tagengo/2/20926.html
 *
 * 座標はすべてNominatim(OSM)で確認。
 *
 * あわせて、ひがし茶屋街の視察開始時刻に本番で15分の空白(決まりA違反の
 * 疑いがある未説明のずれ)があったため、移動時間どおりに補正。ひがし茶屋街
 * 末尾の「両方を巡る金沢の旅をお楽しみいただけたことでしょう」という
 * (2か所構成だった当時の)締めの一文は、後ろに4か所続く現在の構成と
 * 合わないため、昼食と午後への案内に差し替えた。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-302-58dbfab5.ts
 * (実行済み。兼六園の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "58dbfab5-20c1-42b9-8315-8ad8f4afdf7c";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "兼六園")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const ichiba = spots.find((s) => s.name === "近江町市場")!;
  const chayagai = spots.find((s) => s.name === "ひがし茶屋街")!;

  // ひがし茶屋街: 開始時刻の空白を補正し、末尾を午後への案内に差し替え
  const staleEnd = "近江町市場のグルメと、ひがし茶屋街の風情、両方を巡る金沢の旅をお楽しみいただけたことでしょう。";
  const newEnd = "散策の途中には甘味処や茶房も多いので、ここで昼食をとりましょう。午後は兼六園や金沢城公園など、加賀百万石の城下町をめぐります。";
  const chayagaiMemo = (chayagai.memo ?? "").includes(staleEnd)
    ? (chayagai.memo ?? "").replace(staleEnd, newEnd)
    : chayagai.memo;

  await updateSpotInItinerary(ITIN_ID, { spotId: chayagai.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 10, 55)),
    memo: chayagaiMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: ichiba.id, data: {} },
        { id: chayagai.id, data: {} },
        {
          create: {
            name: "兼六園",
            address: "金沢市兼六町1",
            lat: 36.5624267,
            lng: 136.6623546,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 30)),
            stayDurationMin: 60,
            transitMode: "bus",
            transitDurationMin: 15,
            memo:
              "ひがし茶屋街からは周遊バスで15分ほどです。兼六園は、加賀藩の歴代藩主が長い歳月をかけて作り上げた大名庭園で、岡山の後楽園、水戸の偕楽園とともに日本三名園の一つに数えられ、国の特別名勝に指定されています。名前は、優れた庭園に必要とされる「六勝」(宏大・幽邃・人力・蒼古・水泉・眺望)を兼ね備えていることに由来します。ことじ灯籠や霞ヶ池、唐崎の松など、四季折々の景観が楽しめる見どころが点在しています。園内をゆっくりと巡りながら、加賀百万石の庭園文化を味わいましょう。",
          },
        },
        {
          create: {
            name: "金沢城公園",
            address: "金沢市丸の内1-1",
            lat: 36.5657619,
            lng: 136.659447,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 38)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "兼六園からは徒歩8分ほどです。金沢城公園は、加賀藩前田家の居城だった金沢城の跡地を整備した公園です。2001年に復元された菱櫓・五十間長屋・橋爪門続櫓は、古絵図や古文書をもとに、当時の姿を忠実に再現した建物です。重要文化財の石川門など歴史的な建造物のほか、種類豊富な石垣も見どころで、「石垣の博物館」とも呼ばれています。広い園内を歩きながら、加賀百万石の城下町の中心地だった歴史を感じてみましょう。",
          },
        },
        {
          create: {
            name: "金沢21世紀美術館",
            address: "金沢市広坂1-2-1",
            lat: 36.5608382,
            lng: 136.6582097,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 48)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "金沢城公園からは徒歩10分ほどです。金沢21世紀美術館は、建築家ユニットSANAAが設計した、円形の外観とガラス張りの外壁が特徴の現代美術館です。「まちに開かれた公園のような美術館」をコンセプトに、無料で入れる交流ゾーンには、レアンドロ・エルリッヒの「スイミング・プール」をはじめとする恒久展示作品が点在しています。有料の展覧会ゾーンでは企画展も開催されていますが、休館日があるので、訪れる前に公式の案内で確かめましょう。",
          },
        },
        {
          create: {
            name: "尾山神社",
            address: "金沢市尾山町11-1",
            lat: 36.5659713,
            lng: 136.6554788,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 58)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "金沢21世紀美術館からは徒歩10分ほどです。尾山神社は、加賀藩の初代藩主・前田利家を祀る神社で、明治6年(1873)に創建されました。正門にあたる神門は、明治8年(1875)に建てられたもので、日本建築の木造の骨組みに、洋風のギヤマン(色ガラス)をはめ込んだ和漢洋折衷の珍しい様式が特徴です。国の重要文化財に指定されています。参拝の際は、静かに、敬意をもって見学しましょう。参拝を終えたら、香林坊・片町方面へ歩き、バスやタクシーで金沢駅へ戻りましょう。",
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

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
