/**
 * #122 b9644a96(兼六園の雪吊りと冬の金沢)の直し。
 * もとは2か所(兼六園→ひがし茶屋街)、09:30〜12:10で終了(4か所未満・終了)。
 * 金沢21世紀美術館・金沢城公園・近江町市場・主計町茶屋街を追加し、
 * 09:30〜16:32の6か所に。徒歩でめぐれる中心部の冬の散策プラン(winter限定)。
 *
 * 文章は案内役の口調をサイトの標準に直し、兼六園の「唐崎松の雪吊りおよそ
 * 800本」は出典(shiro-niwa.pref.ishikawa.lg.jp、ja.wikipedia.org/wiki/兼六園)
 * で本数を確認できなかったため「数百本ともいわれる」に弱めた。
 *
 * 事実の出典:
 * - 金沢21世紀美術館: ja.wikipedia.org/wiki/金沢21世紀美術館(2004年開館、
 *   妹島和世・西沢立衛(SANAA)設計、スイミング・プール)
 * - 金沢城公園: ja.wikipedia.org/wiki/金沢城(石川門は現存・重要文化財、
 *   菱櫓等は2001年復元)
 * - 近江町市場: ja.wikipedia.org/wiki/近江町市場(江戸時代起源、店舗数は
 *   出典により差があるため具体的な数は書かない)
 * - 主計町茶屋街: ja.wikipedia.org/wiki/主計町茶屋街(2008年重要伝統的
 *   建造物群保存地区)
 *
 * 座標(すべてOSM/Nominatim):
 * - 金沢21世紀美術館: 36.5608382, 136.6582097(osm_id 197980653)
 * - 金沢城公園: 36.5657619, 136.6594470(osm_id 128905245)
 * - 近江町市場: 36.5718658, 136.6557781(osm_id 10792965205)
 * - 主計町茶屋街: 36.5723030, 136.6636290(osm_id 2146147851)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KENROKUEN_MEMO =
  "金沢駅からバスでおよそ15分、水戸の偕楽園、岡山の後楽園とあわせて日本三名園に数えられる、加賀藩前田家ゆかりの大名庭園・兼六園に着きます。冬の兼六園を象徴するのが「雪吊り」で、松の枝を雪の重みから守るため、11月から3月ごろにかけて、縄を円錐状に張り巡らせます。中でも「唐崎松」と呼ばれる黒松には、中心の柱から数百本ともいわれる縄が放射状に張られ、その幾何学的な美しさから兼六園の冬の風物詩として知られています。雪化粧した庭園に、雪吊りの縄が織りなす繊細な景観は、この季節だけの特別な眺めです。足元が滑りやすいこともあるので、歩きやすい靴で気をつけて歩きましょう。この後は、歩いておよそ6分、金沢21世紀美術館へ向かいましょう。";

const MUSEUM_21_MEMO =
  "兼六園から歩いておよそ6分、金沢21世紀美術館に着きます。平成16年(2004)に開館した、妹島和世・西沢立衛(SANAA)の設計による、円形の総ガラス張りの美術館です。地上と地下の両方から見られるレアンドロ・エルリッヒの「スイミング・プール」をはじめ、まちに開かれた公園のような空間に、さまざまな現代美術作品が展示されています。この後は、歩いておよそ10分、金沢城公園へ向かいましょう。";

const KANAZAWA_CASTLE_MEMO =
  "金沢21世紀美術館から歩いておよそ10分、金沢城公園に着きます。加賀百万石の藩主・前田家の居城だった金沢城の跡で、江戸時代から残る石川門(重要文化財)や、平成13年(2001)に木造で復元された菱櫓・五十間長屋などの建物が立ち並びます。雪化粧した白壁の美しさを眺めましょう。この後は、歩いておよそ15分、近江町市場へ向かいましょう。";

const OMICHO_MEMO =
  "金沢城公園から歩いておよそ15分、近江町市場に着きます。江戸時代から続く、金沢の台所として親しまれている市場で、加賀野菜や日本海の海産物を扱う店が多く並びます。ここで昼食にしましょう。この後は、歩いておよそ10分、主計町茶屋街へ向かいましょう。";

const KAZUEMACHI_MEMO =
  "近江町市場から歩いておよそ10分、主計町茶屋街に着きます。浅野川沿いに石畳が敷かれ、料亭や茶屋が並ぶ町並みで、ひがし・にしと並ぶ金沢の茶屋街の一つです。虫籠窓と呼ばれる格子窓の町家が今も残り、平成20年(2008)には国の重要伝統的建造物群保存地区に選定されました。雪景色の石畳は、特に趣深い眺めです。この後は、歩いておよそ6分、ひがし茶屋街へ向かいましょう。";

const HIGASHI_MEMO =
  "主計町茶屋街から歩いておよそ6分、ひがし茶屋街に着きます。文政3年(1820)、加賀藩によって公認された、金沢で最も格式の高い茶屋街です。紅殻格子の茶屋建築が並ぶ石畳の通りは、雪が降り積もると、朱色の格子と白い雪が織りなす、ひときわ趣深い景色に姿を変えます。国の重要伝統的建造物群保存地区にも選定されたこの町並みには、文政3年建築の茶屋「志摩」をはじめ、当時の面影を伝える建物が今も大切に残されています。足元が滑りやすくなっていることもありますので、雪の日は歩きやすい靴で気をつけましょう。あたたかい甘味処でひと息ついて、雪景色ならではの金沢の情緒を味わいましょう。バスやタクシーで金沢駅まで戻り、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b9644a96%'`);
  const itinId = rows[0].id;
  const day = await prisma.day.findFirst({ where: { itineraryId: itinId } });
  if (!day) throw new Error("dayが見つかりません");

  const existing = await prisma.spot.findMany({ where: { dayId: day.id }, orderBy: { orderNo: "asc" } });
  const kenrokuen = existing.find((s) => s.name === "兼六園");
  const higashi = existing.find((s) => s.name === "ひがし茶屋街");
  if (!kenrokuen || !higashi) throw new Error("既存スポットが見つかりません(既に直っている可能性)");

  console.log("確認OK。dayId:", day.id);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await setDaySpotOrder(
    day.id,
    [
      { id: kenrokuen.id, data: { memo: KENROKUEN_MEMO, visitTime: t(9, 30), stayDurationMin: 80 } },
      {
        create: {
          name: "金沢21世紀美術館",
          memo: MUSEUM_21_MEMO,
          lat: 36.5608382,
          lng: 136.6582097,
          visitTime: t(10, 56),
          stayDurationMin: 70,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        create: {
          name: "金沢城公園",
          memo: KANAZAWA_CASTLE_MEMO,
          lat: 36.5657619,
          lng: 136.6594470,
          visitTime: t(12, 16),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "近江町市場",
          memo: OMICHO_MEMO,
          lat: 36.5718658,
          lng: 136.6557781,
          visitTime: t(13, 31),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
        },
      },
      {
        create: {
          name: "主計町茶屋街",
          memo: KAZUEMACHI_MEMO,
          lat: 36.5723030,
          lng: 136.6636290,
          visitTime: t(14, 41),
          stayDurationMin: 30,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        id: higashi.id,
        data: {
          memo: HIGASHI_MEMO,
          visitTime: t(15, 17),
          stayDurationMin: 75,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
    ]
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
