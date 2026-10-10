/**
 * #95 310ab81d（表浜海岸とサーフィン文化、太平洋を望む豊橋の海1泊2日）
 * 通常の見直し。既存はD1表浜海岸1か所(10:00〜11:10)・D2「豊橋市田原市境
 * 表浜海岸展望」1か所(09:30〜10:10)のみで、両日とも4か所未満・終了とも
 * 規定外。両日ともツアーガイド口調("皆様、本日ご案内するのは"等)だった
 * ため書き直した。
 *
 * D1は表浜海岸(既存)から西へ、サンテパルクたはら→太平洋ロングビーチ→
 * 道の駅あかばねロコステーション→恋路ヶ浜→日出の石門→伊良湖岬灯台の順
 * (戻らない道をOSRM実測で確認、いずれも公式サイトで内容を確認)。
 * D2は伊良湖から北上し、道の駅伊良湖クリスタルポルト→白谷海浜公園→
 * 蔵王山展望台→田原市博物館(田原城跡)→岩屋緑地公園(豊橋市)の順で
 * 豊橋方面へ戻る。既存D2の「豊橋市田原市境 表浜海岸展望」は、内容が
 * D1の表浜海岸と重複するため見送り(削除)。
 *
 * 開いたURL:
 * - 表浜海岸(距離約50km・片浜十三里): 愛知県公式Aichi Now
 *   https://aichinow.pref.aichi.jp/spots/detail/3714/
 * - アカウミガメ産卵(5〜8月): WebSearch集約(東愛知新聞等)
 * - サンテパルクたはら(施設内容): 田原市公式
 *   https://www.city.tahara.aichi.jp/kankou/kankou/1002668.html
 * - 太平洋ロングビーチ・道の駅あかばねロコステーション(サーフィン世界大会):
 *   田原市公式 https://www.city.tahara.aichi.jp/shisetsu/kankou/1002477.html
 * - 恋路ヶ浜・伊良湖岬灯台・日出の石門: 田原市公式
 *   https://www.city.tahara.aichi.jp/kankou/kankou/1002668.html
 * - 白谷海浜公園(開設年・竜宮まつり): 田原市公式
 *   https://www.city.tahara.aichi.jp/shisetsu/kankou/1002460.html /
 *   net-plaza.org https://www.net-plaza.org/KANKO/tahara/koen/shiroya-kaisui/index.html
 * - 蔵王山展望台: 田原市公式(同上1002668.html)
 * - 田原市博物館・田原城跡(渡辺崋山・一掃百態図): WebSearch集約
 *   (文化庁文化遺産オンライン・るるぶ&more.等)
 * - 岩屋緑地公園(岩屋観音・展望台・桜): 豊橋観光コンベンション協会
 *   https://www.honokuni.or.jp/toyohashi/spot/000088.html
 * - 座標: Nominatim(OSM)。移動時間はOSRM(driving)実測
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OMOTEHAMA_MEMO =
  "渥美半島の伊良湖岬から浜名湖の近くまで、およそ50キロメートルにわたって続く太平洋沿いの海岸で、「片浜十三里」とも呼ばれています。遠州灘の荒波が生み出す変化に富んだ地形は、国内外から多くのサーファーが集まるサーフィンの盛んな海岸として知られ、過去には世界大会も開催されました。また、絶滅が心配されるアカウミガメの産卵地としても知られ、5月ごろから8月にかけて、砂浜に上陸して産卵する姿が見られることがあります。サーフィンを楽しむ人々の姿と、太平洋の雄大な景色が広がっています。この後は、車でおよそ26分、サンテパルクたはらへ向かいましょう。";

const SANTEPARK_MEMO =
  "表浜海岸から車でおよそ26分、サンテパルクたはらに着きます。農業をテーマにした体験型の施設で、四季の花が楽しめる花畑「サンテガーデン」や、農業について学べる「サラダ館」、ウインナーやパンづくりが体験できる「体験工房」、ニワトリやウサギとふれあえる小動物園などがあります。4000平方メートルの畑での野菜の収穫体験ができるほか、地元の農畜産物を扱う直売所もあり、ここで昼食にするのもよいでしょう。動物に食べ物をあげたり、さくに手を入れたりしないようにしましょう。この後は、車でおよそ9分、太平洋ロングビーチへ向かいましょう。";

const LONGBEACH_MEMO =
  "サンテパルクたはらから車でおよそ9分、太平洋ロングビーチに着きます。約20キロメートルにも及ぶ真っ直ぐで壮大な砂浜が続く、サーフィンのメッカとして知られるビーチです。ヤシの木が並ぶ南国のような雰囲気の中、波と戯れるサーファーたちの姿を眺めながら、海辺をゆっくりと散策できます。この後は、車でおよそ2分、道の駅あかばねロコステーションへ向かいましょう。";

const AKABANE_MEMO =
  "太平洋ロングビーチから車でおよそ2分、道の駅あかばねロコステーションに着きます。地元の海産物や農産物、鉢花を販売しているほか、レストランやサーフショップもあり、海を見ながら過ごせる道の駅です。展望台からは赤羽根海岸を望むことができ、赤羽根海岸は全国有数のサーフポイントとして知られ、サーフィンの世界大会が開かれたこともあります。この後は、車でおよそ12分、恋路ヶ浜へ向かいましょう。";

const KOIJIGAHAMA_MEMO =
  "道の駅あかばねロコステーションから車でおよそ12分、恋路ヶ浜に着きます。伊良湖岬灯台から日出の石門まで、およそ1キロメートルにわたって続く、太平洋の荒波をうけて弓なりに湾曲する美しい砂浜です。渥美半島の先端らしい、雄大な太平洋の景色を眺めながら、波打ち際を歩いてみてください。この後は、車でおよそ4分、日出の石門へ向かいましょう。";

const HIIDENOSEKIMON_MEMO =
  "恋路ヶ浜から車でおよそ4分、日出の石門に着きます。太平洋の荒波の浸食によってできた、中央に洞穴のあいた岩で、沖の石門と岸の石門の2つがあります。日の出の時間帯に見られる美しいシルエットでも知られ、荒々しい岩と青い海が織りなす景色を楽しめます。この後は、車でおよそ5分、伊良湖岬灯台へ向かいましょう。";

const IRAGOLIGHTHOUSE_MEMO =
  "日出の石門から車でおよそ5分、伊良湖岬灯台に着きます。渥美半島の最先端に立つ白亜の灯台で、黒潮がおどる太平洋と、波静かな三河湾の両方を望むことができます。平成10年(1998)には「日本の灯台50選」にも選ばれました。今夜はこの近くの宿に泊まります。";

const CRYSTALPORT_MEMO =
  "旅の2日目は、道の駅伊良湖クリスタルポルトからスタートです。伊良湖岬にあるフェリーターミナルを兼ねた道の駅で、地元・三河湾のりを使ったオリジナル商品なども販売されています。フェリー乗り場からは、伊勢湾を行き交う船の姿を眺めることもできます。この後は、車でおよそ20分、白谷海浜公園へ向かいましょう。";

const SHIROYA_MEMO =
  "道の駅伊良湖クリスタルポルトから車でおよそ20分、白谷海浜公園に着きます。三河湾国定公園内にある、白い砂浜の海水浴場を中心とした公園で、平成9年(1997)に海水浴場が、平成13年(2001)にはトラック(陸上競技場)が整備されました。海風を感じながら、自然豊かな園内を散策できます。8月15日には、地元に伝わる「竜宮まつり」が開かれることでも知られています。この後は、車でおよそ10分、蔵王山展望台へ向かいましょう。";

const ZAOSAN_MEMO =
  "白谷海浜公園から車でおよそ10分、蔵王山展望台に着きます。渥美半島のほぼ中央にそびえる蔵王山の山頂にある展望施設で、穏やかな三河湾と、波の高い太平洋の両方を一望できます。複数の階からなる展望フロアがあり、渥美半島のパノラマをゆっくりと楽しめます。この後は、車でおよそ7分、田原市博物館へ向かいましょう。";

const TAHARAMUSEUM_MEMO =
  "蔵王山展望台から車でおよそ7分、田原市博物館に着きます。文明12年(1480)ごろに戸田宗光が築いたと伝わる田原城の跡に建つ博物館で、周囲を海に囲まれた堅牢な城としても知られていました。館内には、田原藩の家老で、蘭学者・画家としても知られる渡辺崋山に関する資料が展示されており、国の重要文化財「一掃百態図」もこの中で紹介されています。城跡をあわせて散策してみてください。この付近で昼食にするのもよいでしょう。この後は、車でおよそ20分、岩屋緑地公園へ向かいましょう。";

const IWAYA_MEMO =
  "田原市博物館から車でおよそ20分、岩屋緑地公園に着きます。天平2年(730)、行基がこの地を訪れた際、千手観音像を刻んで岩窟に安置したのが起源と伝えられる岩屋観音があり、東海道を行き交う旅人たちの信仰を集めてきました。岩窟の前では、静かにお参りしましょう。頂上には高さ15メートルの展望台があり、豊橋市街を一望でき、晴れた日には鈴鹿山脈まで望めます。木製の大型遊具「冒険砦」もあり、春には1,000本を超える桜並木も見事です。太平洋を望む豊橋の海、1泊2日の旅は、ここで終わりです。お帰りは、駐車場に停めた車で戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const omotehama = await findSpotInItinerary(itinId, { spotName: "表浜海岸" });
  const oldD2 = await findSpotInItinerary(itinId, { spotName: "豊橋市田原市境 表浜海岸展望" });

  const day1Spots: SpotOrderItem[] = [
    { id: omotehama.id, data: { memo: OMOTEHAMA_MEMO, visitTime: t(9, 0), stayDurationMin: 65, transitMode: null, transitDurationMin: null, transitLine: null } },
    {
      create: {
        name: "サンテパルクたはら",
        address: "愛知県田原市芦町",
        lat: 34.643565,
        lng: 137.202316,
        memo: SANTEPARK_MEMO,
        visitTime: t(10, 31),
        stayDurationMin: 95,
        transitMode: "car",
        transitDurationMin: 26,
        transitLine: null,
      },
    },
    {
      create: {
        name: "太平洋ロングビーチ",
        address: "愛知県田原市",
        lat: 34.608259,
        lng: 137.198791,
        memo: LONGBEACH_MEMO,
        visitTime: t(12, 15),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    {
      create: {
        name: "道の駅あかばねロコステーション",
        address: "愛知県田原市赤羽根町",
        lat: 34.607619,
        lng: 137.189587,
        memo: AKABANE_MEMO,
        visitTime: t(13, 17),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "恋路ヶ浜",
        address: "愛知県田原市伊良湖町",
        lat: 34.580325,
        lng: 137.024307,
        memo: KOIJIGAHAMA_MEMO,
        visitTime: t(14, 9),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 12,
        transitLine: null,
      },
    },
    {
      create: {
        name: "日出の石門",
        address: "愛知県田原市伊良湖町",
        lat: 34.577464,
        lng: 137.038671,
        memo: HIIDENOSEKIMON_MEMO,
        visitTime: t(15, 3),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "伊良湖岬灯台",
        address: "愛知県田原市",
        lat: 34.579409,
        lng: 137.016219,
        memo: IRAGOLIGHTHOUSE_MEMO,
        visitTime: t(15, 43),
        stayDurationMin: 48,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      create: {
        name: "道の駅伊良湖クリスタルポルト",
        address: "愛知県田原市伊良湖町",
        lat: 34.583583,
        lng: 137.020254,
        memo: CRYSTALPORT_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 50,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "白谷海浜公園",
        address: "愛知県田原市白磯",
        lat: 34.68516,
        lng: 137.232569,
        memo: SHIROYA_MEMO,
        visitTime: t(10, 40),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      create: {
        name: "蔵王山展望台",
        address: "愛知県田原市吉胡町",
        lat: 34.684769,
        lng: 137.261956,
        memo: ZAOSAN_MEMO,
        visitTime: t(11, 50),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "田原市博物館",
        address: "愛知県田原市田原町",
        lat: 34.673692,
        lng: 137.269092,
        memo: TAHARAMUSEUM_MEMO,
        visitTime: t(12, 57),
        stayDurationMin: 95,
        transitMode: "car",
        transitDurationMin: 7,
        transitLine: null,
      },
    },
    {
      create: {
        name: "岩屋緑地公園",
        address: "愛知県豊橋市",
        lat: 34.73226,
        lng: 137.429039,
        memo: IWAYA_MEMO,
        visitTime: t(14, 52),
        stayDurationMin: 100,
        transitMode: "car",
        transitDurationMin: 20,
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
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  };
  printSchedule("D1", day1Spots);
  printSchedule("D2", day2Spots);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx, remove: [oldD2.id] });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
