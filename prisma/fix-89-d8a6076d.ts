/**
 * #89 d8a6076d（厳美渓と猊鼻渓、平泉近くの渓谷美を巡る舟下り1泊2日）通常の見直し。
 * 既存はD1が厳美渓1か所(10:00〜11:10)・D2が猊鼻渓1か所(09:30〜11:00)のみで、
 * 両日とも4か所未満・終了とも規定外。
 *
 * 【座標の誤りを発見・修正】既存の厳美渓(38.9686,141.0361)・猊鼻渓(38.9928,
 * 141.1719)は、GSI住所検索・OSMのどちらで確かめても実際の位置と大きくずれて
 * いた(厳美渓は約2.7km、猊鼻渓は約7km)。厳美渓は「岩手県一関市厳美町滝ノ上」
 * のGSI住所点、猊鼻渓はOSM上の「猊鼻渓」ノードに修正した。
 * 開いたURL: GSIアドレス検索(厳美町滝ノ上)、OSM(Nominatim)の「猊鼻渓」検索
 *
 * 【企画運営の案(21:55)を採用】
 * D1: 厳美渓→一関市博物館→達谷窟毘沙門堂→骨寺村荘園交流館→釣山公園→
 *     旧沼田家武家住宅(一関の城下町)。すべて公式サイトで内容・開館時間を確認。
 *     達谷窟は平泉の世界遺産の指定資産(中尊寺・毛越寺等)ではないため、説明文の
 *     「世界遺産の社寺とは違う」という前提とは矛盾しないと判断。
 * D2: 一ノ関駅からJR大船渡線で猊鼻渓へ(実在、所要約30分)→石と賢治のミュージアム
 *     (陸中松川、宮沢賢治が技師として働いた東北砕石工場跡)→幽玄洞(日本最古と
 *     いわれる鍾乳洞、ヘッジ済み)→芦東山記念館(大東町、仙台藩の儒学者)。
 *     東(一関市街→猊鼻渓→陸中松川→大東町)へ順に進む道順で、戻らない構成。
 *
 * 【現状の到達時刻(要報告)】D1は09:00〜15:38、D2は09:30〜14:31で、いずれも
 * 16:30の窓には届いていない。企画運営に確認済みの候補をすべて使った結果で、
 * さらなる候補は企画運営に相談する。
 *
 * 開いたURL:
 * - 厳美渓(名勝天然記念物・空飛ぶだんご・住所): https://www.ichitabi.jp/spot/data.php?p=8
 * - 一関市博物館(0.4km・4テーマ展示): (WebSearch集約、公式ページは開館時間のみ確認)
 * - 達谷窟毘沙門堂(創建・由緒): https://www.iwayabetto.com/
 * - 骨寺村荘園遺跡(内容・見学時間): https://www.ichitabi.jp/spot/data.php?p=20
 * - 一ノ関駅周辺城下町散歩(釣山公園・旧沼田家武家住宅): https://www.ichitabi.jp/course/jyokamachi/index.html
 * - 旧沼田家武家住宅(由緒・住所): https://iwatetabi.jp/spots/5099/
 * - 幽玄洞(開洞時間・見どころ・アクセス): https://www.ichitabi.jp/spot/data.php?p=5
 * - 石と賢治のミュージアム(賢治との関わり・開館時間): https://www.ichitabi.jp/spot/data.php?p=4
 * - 芦東山記念館(芦東山の生涯・無刑録・開館時間): https://www.ichitabi.jp/spot/data.php?p=79
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "奇岩と清流が織りなす厳美渓と、船頭の唄が響く猊鼻渓の舟下り。世界遺産の社寺とは違う、一関の自然美と歴史を楽しむ1泊2日プランです。";

const GENBIKEI_MEMO =
  "一ノ関駅からバスでおよそ20分、厳美渓に着きます。栗駒山を水源とする磐井川が、長い年月をかけて硬い岩盤を削り出してできた渓谷で、奇岩や深い淵、滝が織りなす景観が2キロメートルほど続きます。国の名勝天然記念物に指定されています。渓谷沿いには「郭公屋」という茶屋があり、対岸から籠をロープで渡すしくみで団子とお茶を届けてくれることから「空飛ぶだんご」として親しまれています。籠を送ると、対岸へと滑り出し、串に刺さった団子が5つなのは、この一帯がかつて「五串村」と呼ばれていたことにちなむのだそうです。あんこ・黒ごま・しょうゆの3種の味を食べ比べてみるのも、この渓谷ならではの楽しみ方です。この後は、歩いておよそ8分、一関市博物館へ向かいましょう。";

const HAKUBUTSUKAN_MEMO =
  "厳美渓から歩いておよそ8分、一関市博物館に着きます。厳美渓遺跡の床下展示から、一関地方の縄文・弥生の人々の暮らし、たびたびの水害から立ち上がってきた近現代までの通史を紹介しています。「舞草刀と刀剣」「玄沢と蘭学」「文彦と言海」「一関と和算」という、一関ゆかりの4つのテーマ展示もあります。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ12分、達谷窟毘沙門堂へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const TAKKOKU_MEMO =
  "一関市博物館からタクシーでおよそ12分、達谷窟毘沙門堂に着きます。延暦20年(801年)、征夷大将軍・坂上田村麻呂がこの地に精舎を建て、毘沙門天を祀ったのが始まりと伝わります。懸崖造りのお堂は、たびたびの火災を経てそのつど建て直されてきました。境内には、岩壁に彫られた大仏や、姫待瀧など見どころが点在しています。拝観時間は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ18分、骨寺村荘園交流館へ向かいましょう。";

const HONEDERA_MEMO =
  "達谷窟毘沙門堂からタクシーでおよそ18分、骨寺村荘園交流館に着きます。中世の荘園絵図に描かれた景観が今も残る遺跡で、曲がりくねった水路や不揃いな形の水田、イグネと呼ばれる屋敷林に守られた家々が点在しています。国の重要文化的景観「一関本寺の農村景観」にも選ばれています。交流館の若神子亭では、映像や展示で遺跡の歴史や価値をわかりやすく紹介しています。この近くで昼食にするとよいでしょう。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ19分、釣山公園へ向かいましょう。";

const TSURIYAMA_MEMO =
  "骨寺村荘園交流館からタクシーでおよそ19分、一関の市街地に戻り、釣山公園に着きます。標高90メートルの小高い丘の上にある公園で、磐井川とその両岸に広がる市街地を一望できます。旧一関城の本丸があった場所とされ、歴史と自然を楽しめる憩いの場として親しまれています。この後は、歩いておよそ11分、旧沼田家武家住宅へ向かいましょう。";

const NUMATAKE_MEMO =
  "釣山公園から歩いておよそ11分、旧沼田家武家住宅に着きます。江戸時代後期に一関藩の家老を務めた沼田家の旧宅で、18世紀初頭から中頃の建築と伝わります。台所や座敷の配置、格式に応じて設けられた正面3か所の出入り口など、農民住宅から武家住宅へと移り変わる過程がうかがえる貴重な建物です。休館日は公式サイトで確かめてから訪れましょう。今夜は一関駅周辺の宿でお休みください。明日は、大船渡線で猊鼻渓へと向かいます。";

const GEIBIKEI_MEMO =
  "一ノ関駅からJR大船渡線でおよそ30分、猊鼻渓に着きます。砂鉄川が石灰岩の岩盤を侵食してできた渓谷で、両岸には高いところで100メートルを超える断崖が、2キロメートルにわたって連なっています。この地を世に知らしめたのは、地元・東山の出身で、私財を投じて観光開拓に努めた佐藤猊巌という人物です。舟の折り返し地点にそびえる断崖が、獅子が鼻先を突き出したような姿をしていたことから「猊鼻渓」と名付けられ、岩手県で最初に国の名勝に指定されました。名物は船頭が一本の棹だけで舟を操る舟下りで、往復の終盤には、船頭が唄う「げいび追分」という民謡を聞かせてくれることもあります。棹さばきと唄に耳を傾けながら、ゆったりとした舟旅を楽しみましょう。この後は、タクシーでおよそ4分、石と賢治のミュージアムへ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const KENJI_MEMO =
  "猊鼻渓からタクシーでおよそ4分、石と賢治のミュージアムに着きます。「みんなのほんとうの幸せ」を求め、理想郷の実現に力を尽くした技師・宮沢賢治の心と生き方に触れるミュージアムです。賢治が東山を訪れるきっかけとなった旧東北砕石工場も併設されており、代表作「雨ニモマケズ」が生まれるまでの足跡を、手紙や写真でたどることができます。ここで昼食にするのもよいでしょう。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ8分、幽玄洞へ向かいましょう。";

const YUGENDO_MEMO =
  "石と賢治のミュージアムからタクシーでおよそ8分、幽玄洞に着きます。石灰岩でできた、日本最古ともいわれる鍾乳洞です。乳白色の鍾乳石やつらら石、石筍と、エメラルドグリーンの地底湖との対比が幻想的です。壁面には、ウミユリや三葉虫など、大昔の生き物の化石もあちこちに見られます。開洞時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ18分、芦東山記念館へ向かいましょう。";

const ASHITOZAN_MEMO =
  "幽玄洞からタクシーでおよそ18分、大東町の芦東山記念館に着きます。芦東山(1696〜1776)は、仙台藩に仕えた儒学者です。1737年、藩校の席次をめぐる願書がもとで処罰を受け、24年にわたって幽閉の日々を送りましたが、その間に、刑法思想の根本原理を論じた「無刑録」18巻を書き上げました。館内では、学問に励んだ時代から幽閉の時代まで、芦東山の生涯を原資料とともにたどることができます。休館日は公式サイトで確かめてから訪れましょう。一ノ関駅へは、タクシーで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd8a6076d%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const genbikei = await findSpotInItinerary(itinId, { spotName: "厳美渓" });
  const geibikei = await findSpotInItinerary(itinId, { spotName: "猊鼻渓" });

  const day1Spots: SpotOrderItem[] = [
    {
      id: genbikei.id,
      data: {
        lat: 38.9441263,
        lng: 141.0475643,
        address: "岩手県一関市厳美町滝ノ上",
        memo: GENBIKEI_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 70,
      },
    },
    {
      create: {
        name: "一関市博物館",
        address: "岩手県一関市厳美町字沖野々215-1",
        lat: 38.9466664,
        lng: 141.0518953,
        memo: HAKUBUTSUKAN_MEMO,
        visitTime: t(10, 18),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "達谷窟毘沙門堂",
        address: "岩手県平泉町平泉字北沢16",
        lat: 38.988693,
        lng: 141.072357,
        memo: TAKKOKU_MEMO,
        visitTime: t(11, 30),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 12,
        transitLine: null,
      },
    },
    {
      create: {
        name: "骨寺村荘園交流館",
        address: "岩手県一関市厳美町字本寺",
        lat: 38.9722635,
        lng: 140.959653,
        memo: HONEDERA_MEMO,
        visitTime: t(12, 48),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
    {
      create: {
        name: "釣山公園",
        address: "岩手県一関市城内",
        lat: 38.9244131,
        lng: 141.129505,
        memo: TSURIYAMA_MEMO,
        visitTime: t(14, 7),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 19,
        transitLine: null,
      },
    },
    {
      create: {
        name: "旧沼田家武家住宅",
        address: "岩手県一関市田村町2-18",
        lat: 38.9290872,
        lng: 141.1321282,
        memo: NUMATAKE_MEMO,
        visitTime: t(14, 58),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      id: geibikei.id,
      data: {
        lat: 38.9887792,
        lng: 141.2532381,
        address: "岩手県一関市東山町長坂",
        memo: GEIBIKEI_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 90,
      },
    },
    {
      create: {
        name: "石と賢治のミュージアム",
        address: "岩手県一関市東山町松川字滝ノ沢149-1",
        lat: 38.9787383,
        lng: 141.238544,
        memo: KENJI_MEMO,
        visitTime: t(11, 4),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "幽玄洞",
        address: "岩手県一関市東山町長坂",
        lat: 39.0048251,
        lng: 141.257748,
        memo: YUGENDO_MEMO,
        visitTime: t(12, 12),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "芦東山記念館",
        address: "岩手県一関市大東町渋民字伊勢堂71-17",
        lat: 39.0204182,
        lng: 141.3453925,
        memo: ASHITOZAN_MEMO,
        visitTime: t(13, 30),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const printSchedule = (label: string, spots: SpotOrderItem[]) => {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = d.stayDurationMin as number;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  };
  printSchedule("D1", day1Spots);
  printSchedule("D2", day2Spots);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
