/**
 * #113 79db7413(函館・大沼公園)のDay2を新規に組む。企画運営の案内
 * (14:09)にある函館山ふもと・元町エリアの候補を使い、既存3か所
 * (函館朝市・旧函館区公会堂・金森赤レンガ倉庫)に9か所を追加して
 * 09:00〜16:32に組んだ。
 *
 * 函館朝市→青函連絡船記念館摩周丸→金森赤レンガ倉庫(昼食)→
 * 函館市地域交流まちづくりセンター→函館市北方民族資料館→
 * 旧イギリス領事館→旧函館区公会堂→カトリック元町教会→
 * 函館聖ヨハネ教会→函館ハリストス正教会→八幡坂→函館市文学館
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 摩周丸: 1988年の青函航路廃止まで運航した連絡船を係留した記念館、
 *   操舵室・無線室が当時のまま見学できる(洞爺丸事故の犠牲者数などの
 *   詳しい記述はせず、船の歴史・施設の紹介にとどめた): hakobura.jp等
 * - 地域交流まちづくりセンター: 旧丸井今井百貨店函館支店、大正12年
 *   (1923)築の鉄筋コンクリート造3階建て、昭和5年(1930)5階建てに増築、
 *   昭和9年(1934)の函館大火後に補強・最新式エレベーターを設置、
 *   東北以北最古とされる手動式エレベーターが今も残る、平成19年(2007)
 *   からまちづくりセンターに: hakomachi.com等
 * - 北方民族資料館: 大正15年(1926)築の旧日本銀行函館支店、1989年から
 *   資料館、アイヌ民俗学者・馬場修/児玉作左衛門両博士のコレクション
 *   中心(馬場コレクションは国の重要有形民俗文化財): 検索結果各種
 * - 旧イギリス領事館: 大正2年(1913)〜昭和9年(1934)まで領事館として
 *   使用: ja.wikipedia.org等
 * - カトリック元町教会: ゴシック様式、大正13年(1924)、焼け残った
 *   煉瓦を使い再建、高さ33mの尖塔: ja.wikipedia.org等
 * - 聖ヨハネ教会: 白壁に十字架を刻み、どの角度からも屋根が十字架の
 *   形に見える特徴的な建築、1979年再建: ja.wikipedia.org等
 * - ハリストス正教会: 白壁・緑屋根、鐘の音が環境省「残したい日本の
 *   音風景100選」(1996年)に選ばれ、通称「ガンガン寺」: ja.wikipedia.org等
 * - 八幡坂: 港へまっすぐ延びる石畳の坂、函館八幡宮がかつてあった場所
 *   (1880年の大火後に移転、名前だけ残る): hakobura.jp等
 * - 函館市文学館: 大正10年(1921)築の旧第一銀行函館支店、平成5年
 *   (1993)開館、吹き抜けに五稜郭の星形モチーフのステンドグラス、
 *   石川啄木の自筆資料や遺品を多数展示: 検索結果各種
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ASAICHI_FROM = "大沼の自然を満喫した翌朝は、この活気の中で朝食を楽しんでみてください。";
const ASAICHI_TO = "大沼・鹿部の自然を満喫した翌朝は、この活気の中で朝食を楽しみましょう。この後は、歩いておよそ4分、青函連絡船記念館摩周丸へ向かいましょう。";

const MASHUMARU_MEMO =
  "函館朝市から歩いておよそ4分、青函連絡船記念館摩周丸に着きます。昭和63年(1988)の青函トンネル開通にともなう航路廃止まで活躍した連絡船「摩周丸」を、JR函館駅のそばに係留した記念館です。操舵室(船橋)や無線通信室が運航当時のまま残されていて、見学することができます。パネルや模型、映像などで、本州と北海道を結んだ青函連絡船の歴史やしくみを学べます。この後は、歩いておよそ11分、金森赤レンガ倉庫へ向かいましょう。";

const AKARENGA_FROM = "函館の実業家・渡辺熊四郎が1869年に開いた洋物店を起源とし、1887年（明治20年）から倉庫業に乗り出したのが始まりと伝えられています。1907年の大火で6棟を焼失しましたが、燃えにくい構造ですぐに再建され、1909年（明治42年）に現在の姿になりました。今はショップやカフェが並ぶ人気スポットとして、多くの旅行者で賑わっています。旅のお土産を探すのに、最後にぴったりの場所です。";
const AKARENGA_TO =
  "函館の実業家・渡辺熊四郎が1869年に開いた洋物店を起源とし、1887年（明治20年）から倉庫業に乗り出したのが始まりと伝えられています。1907年の大火で6棟を焼失しましたが、燃えにくい構造ですぐに再建され、1909年（明治42年）に現在の姿になりました。今はショップやカフェが並ぶ人気スポットで、食事処も多いので、ここで昼食にしましょう。この後は、歩いておよそ4分、函館市地域交流まちづくりセンターへ向かいましょう。";

const AKARENGA_TITLE_FROM = "1泊2日の締めくくりに立ち寄るのは、赤レンガ造りの倉庫群です。";
const AKARENGA_TITLE_TO = "金森赤レンガ倉庫は、赤レンガ造りの倉庫群です。";

const MACHISENTER_MEMO =
  "金森赤レンガ倉庫から歩いておよそ4分、函館市地域交流まちづくりセンターに着きます。大正12年(1923)、丸井今井百貨店の函館支店として建てられた、鉄筋コンクリート造の建物です。昭和5年(1930)に5階建てへ増築され、昭和9年(1934)の函館大火で内部を焼失したあとも補強修理のうえ、最新式のエレベーターとともに営業を再開しました。館内には、東北以北で最も古いとされる手動式のエレベーターが今も残されています。平成19年(2007)から、まちづくりの拠点として生まれ変わりました。この後は、歩いておよそ8分、函館市北方民族資料館へ向かいましょう。";

const HOPPOU_MEMO =
  "函館市地域交流まちづくりセンターから歩いておよそ8分、函館市北方民族資料館に着きます。大正15年(1926)に建てられた、旧日本銀行函館支店の建物を活用した資料館です。アイヌやウイルタなど、北方の民族に伝わる衣服や道具などの資料を展示しています。函館出身のアイヌ民俗学者・馬場修と児玉作左衛門、両博士が集めたコレクションが中心で、馬場コレクションは国の重要有形民俗文化財に指定されています。この後は、歩いておよそ3分、旧イギリス領事館へ向かいましょう。";

const EIKOKU_MEMO =
  "函館市北方民族資料館から歩いておよそ3分、旧イギリス領事館に着きます。大正2年(1913)から昭和9年(1934)まで、実際にイギリス領事館として使われていた建物です。領事執務室や、当時の暮らしを伝える部屋が再現されていて、函館と西洋諸国との交流の歴史を感じられます。この後は、歩いておよそ3分、旧函館区公会堂へ向かいましょう。";

const KOKAIDO_FROM = "函館の元町地区を象徴する、明治期の洋風建築です。";
const KOKAIDO_TO = "旧イギリス領事館から歩いておよそ3分、函館の元町地区を象徴する、明治期の洋風建築・旧函館区公会堂に着きます。";

const KOKAIDO_END_FROM = "函館グルメの合間に、歴史建築の散策も楽しんでください。";
const KOKAIDO_END_TO = "この後は、歩いておよそ5分、カトリック元町教会へ向かいましょう。";

const CATHOLIC_MEMO =
  "旧函館区公会堂から歩いておよそ5分、カトリック元町教会に着きます。ゴシック様式の聖堂で、明治10年(1877)の創建後、火災による焼失を経て、大正13年(1924)、焼け残った煉瓦を使って再建されました。高さおよそ33mの尖塔を持つ鐘楼が印象的です。ローマ教皇から贈られたとされる祭壇があることでも知られています。今も信仰の対象となっている教会ですので、見学の際は静かに、敬意をもって過ごしましょう。この後は、歩いてすぐ、函館聖ヨハネ教会へ向かいましょう。";

const JOHANE_MEMO =
  "カトリック元町教会から歩いてすぐ、函館聖ヨハネ教会に着きます。白い壁に十字架を刻んだ外壁と、どの角度から見ても十字架の形に見える茶色い屋根が特徴的な教会です。現在の建物は、1979年(昭和54年)に再建されたものです。中世ヨーロッパの教会建築をもとにした、ユニークなデザインを楽しめます。今も信仰の対象となっている教会ですので、敬意をもって見学しましょう。この後は、歩いてすぐ、函館ハリストス正教会へ向かいましょう。";

const HARISUTOSU_MEMO =
  "函館聖ヨハネ教会から歩いてすぐ、函館ハリストス正教会に着きます。白い壁と緑色の屋根が目を引く、ロシア正教の聖堂です。屋根には、冠のような形をした6つの丸い塔(クーポル)が並び、それぞれの先端に十字架が掲げられています。鐘の音の美しさでも知られ、地元では「ガンガン寺」の愛称で親しまれていて、その音色は平成8年(1996)、環境省の「残したい日本の音風景100選」に選ばれました。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ3分、八幡坂へ向かいましょう。";

const HACHIMANZAKA_MEMO =
  "函館ハリストス正教会から歩いておよそ3分、八幡坂に着きます。函館港へまっすぐ延びる、石畳の坂道です。かつてこの場所に函館八幡宮があったことが名前の由来で、明治13年(1880)の大火のあと神社は移転しましたが、坂の名前はそのまま残りました。坂の上から港を見下ろすと、停泊する摩周丸の姿も見える、函館を代表する景観のひとつです。この後は、歩いておよそ3分、函館市文学館へ向かいましょう。";

const BUNGAKUKAN_MEMO =
  "八幡坂から歩いておよそ3分、この旅の締めくくり、函館市文学館に着きます。大正10年(1921)、旧第一銀行函館支店として建てられた、煉瓦と鉄筋コンクリート造の建物を活用した文学館です。吹き抜けのホールには、函館のシンボル・五稜郭の星形をモチーフにしたステンドグラスが飾られています。館内では、明治末期に函館で暮らした歌人・石川啄木の直筆原稿や遺品をはじめ、函館ゆかりの文学者たちの資料を展示しています。大沼の自然から函館の歴史的な街並みまでを歩いた2日間は、これで終わりです。函館駅へ向かい、帰りの電車や飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '79db7413%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const asaichi = await findSpotInItinerary(itinId, { spotName: "函館朝市" });
  const akarenga = await findSpotInItinerary(itinId, { spotName: "金森赤レンガ倉庫" });
  const kokaido = await findSpotInItinerary(itinId, { spotName: "旧函館区公会堂" });

  if (!asaichi.memo!.includes(ASAICHI_FROM)) throw new Error("函館朝市の文言が想定外です");
  if (!akarenga.memo!.includes(AKARENGA_FROM)) throw new Error("金森赤レンガ倉庫の文言が想定外です");
  if (!akarenga.memo!.includes(AKARENGA_TITLE_FROM)) throw new Error("金森赤レンガ倉庫の冒頭が想定外です");
  if (!kokaido.memo!.includes(KOKAIDO_FROM)) throw new Error("旧函館区公会堂の文言が想定外です");
  if (!kokaido.memo!.includes(KOKAIDO_END_FROM)) throw new Error("旧函館区公会堂の結びが想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day2Spots: SpotOrderItem[] = [
    { id: asaichi.id, data: { memo: asaichi.memo!.replace(ASAICHI_FROM, ASAICHI_TO) } },
    {
      create: {
        name: "青函連絡船記念館摩周丸",
        address: "北海道函館市若松町12",
        lat: 41.7729301,
        lng: 140.7218544,
        memo: MASHUMARU_MEMO,
        visitTime: t(9, 54),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      id: akarenga.id,
      data: {
        memo: akarenga.memo!.replace(AKARENGA_TITLE_FROM, AKARENGA_TITLE_TO).replace(AKARENGA_FROM, AKARENGA_TO),
        visitTime: t(10, 45),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
    {
      create: {
        name: "函館市地域交流まちづくりセンター",
        address: "北海道函館市末広町4-19",
        lat: 41.7637213,
        lng: 140.7169553,
        memo: MACHISENTER_MEMO,
        visitTime: t(11, 49),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "函館市北方民族資料館",
        address: "北海道函館市末広町21-7",
        lat: 41.7672054,
        lng: 140.7118498,
        memo: HOPPOU_MEMO,
        visitTime: t(12, 27),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "旧イギリス領事館",
        address: "北海道函館市元町33-14",
        lat: 41.7659793,
        lng: 140.7107059,
        memo: EIKOKU_MEMO,
        visitTime: t(13, 5),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      id: kokaido.id,
      data: {
        memo: kokaido.memo!.replace(KOKAIDO_FROM, KOKAIDO_TO).replace(KOKAIDO_END_FROM, KOKAIDO_END_TO),
        visitTime: t(13, 43),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "カトリック元町教会",
        address: "北海道函館市元町15-30",
        lat: 41.763257,
        lng: 140.71316,
        memo: CATHOLIC_MEMO,
        visitTime: t(14, 28),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "函館聖ヨハネ教会",
        address: "北海道函館市元町3-23",
        lat: 41.7625509,
        lng: 140.7128044,
        memo: JOHANE_MEMO,
        visitTime: t(14, 50),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "函館ハリストス正教会",
        address: "北海道函館市元町3-13",
        lat: 41.7628449,
        lng: 140.7122129,
        memo: HARISUTOSU_MEMO,
        visitTime: t(15, 11),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 1,
        transitLine: null,
      },
    },
    {
      create: {
        name: "八幡坂",
        address: "北海道函館市元町",
        lat: 41.7647232,
        lng: 140.7127413,
        memo: HACHIMANZAKA_MEMO,
        visitTime: t(15, 39),
        stayDurationMin: 15,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "函館市文学館",
        address: "北海道函館市末広町22-5",
        lat: 41.7663866,
        lng: 140.7132486,
        memo: BUNGAKUKAN_MEMO,
        visitTime: t(15, 57),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day2.id, day2Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
