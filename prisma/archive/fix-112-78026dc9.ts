/**
 * #112 78026dc9(大聖院と紅葉谷公園)のDay1組み直し。
 * 企画運営の指示(10/1 14:03)により、Day1は宮島島内の候補すべて
 * (大聖院・紅葉谷公園・大願寺・清盛神社・千畳閣・五重塔・
 * 歴史民俗資料館・大元神社・宮島水族館)を使い、水増しなしの長さで
 * 組んだ。既存2か所(大聖院・紅葉谷公園)は、もとは別々の日に1か所ずつ
 * 置かれていた(Day1に大聖院、Day2に紅葉谷公園)が、企画運営の指示どおり
 * 両方ともDay1(島内)にまとめ、案内口調も直した。大聖院の座標も、
 * 度分秒から丸めた値だったためOSMの点に修正した。
 *
 * 千畳閣→五重塔→紅葉谷公園→大聖院→大願寺(昼食)→歴史民俗資料館→
 * 清盛神社→宮島水族館→大元神社、09:00〜16:46。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 千畳閣(豊国神社)/五重塔: 天正15年(1587)豊臣秀吉が安国寺恵瓊に命じ
 *   大経堂として建立開始・畳857枚分で現存する宮島最大の木造建築・秀吉の
 *   死で未完成のまま現在に至る・明治の神仏分離で本尊は大願寺へ移り
 *   豊国神社(秀吉・加藤清正を祀る)に。五重塔は応永14年(1407)建立・
 *   高さ27.6m・国重要文化財: tabetainjya.com等
 * - 大願寺: 真言宗、本尊は厳島弁財天(日本三大弁財天の一つとされる)、
 *   明治以前は厳島神社の普請奉行として修理・造営を担当、護摩堂に高さ
 *   約4mの不動明王像(白檀製、平成18年再建): jinjyagoshuin.com等
 * - 清盛神社: 昭和29年(1954)創建、清盛の没後770年を記念して境外摂社
 *   「三翁神社」から分祀、西の松原にある: kanko-h.com等
 * - 宮島歴史民俗資料館: 昭和49年(1974)開館、幕末から明治にかけて
 *   醤油醸造業で栄えた豪商・江上家の主屋(1800年代初め建築・国登録
 *   有形文化財)・土蔵など6棟を活用: oniwa.garden等
 * - 大元神社: 厳島神社の摂社で、厳島神社より古い起源を持つとされる、
 *   本殿の屋根は「大元葺」という日本で唯一現存するとされる六枚重ね
 *   三段の柿葺: suoyamaguchi-palace.com等
 * - 宮島水族館(みやじマリン): 瀬戸内海の生き物中心に約380種を展示、
 *   シンボルはスナメリ、カキいかだを再現したカキ水槽、ふれあいの磯:
 *   kids.rurubu.jp等
 *
 * 大願寺(宮島の中心部、食事処が多いエリア)の滞在に昼食を組み込んだ
 * (OSM確認: 千畳閣〜清盛神社の中心部bboxに食事処20件)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAISHOIN_MEMO =
  "大同元年(806)、唐から帰国した弘法大師空海が、宮島の霊峰・弥山で修行したのちに開いたと伝えられる、宮島で最も歴史ある寺院とされる大聖院から、今日は歩き始めます。平清盛をはじめとする平家一門や足利将軍家、豊臣秀吉、伊藤博文といった歴史上の人物のほか、鳥羽天皇や明治天皇といった皇室の方々も参詣に訪れたと伝えられています。仁王門から続く石段の手すりには、一つ回すとお経を一巻唱えるのと同じ功徳があるとされるチベット仏教の法具「摩尼車」が並び、参拝者は石段を上りながら次々と回していきます。境内には、大小さまざまな羅漢像も安置されており、その表情の豊かさも見どころの一つです。今も信仰の対象となっている寺院ですので、境内では静かに、敬意をもってお参りください。この後は、歩いておよそ8分、紅葉谷公園へ向かいましょう。";

const MOMIJIDANI_MEMO =
  "大聖院から歩いておよそ8分、紅葉谷公園に着きます。厳島神社の背後にそびえる弥山の山麓、渓谷沿いに広がる紅葉の名所で、およそ700本ものカエデが植えられ、中でもイロハカエデが最も多くを占めているとされます。公園内を流れる紅葉谷川には、周囲の自然と調和するように整えられた砂防施設があり、まるで日本庭園のような趣を見せています。例年11月中旬から下旬にかけてが紅葉の見頃で、赤い欄干の紅葉橋を色とりどりの葉が彩る光景は、多くの人に親しまれてきました。この公園はまた、弥山への登山道「紅葉谷コース」の入口や、宮島ロープウエーの紅葉谷駅への道ともつながっています。渓谷のせせらぎを聞きながら、静かな散策のひとときを過ごしましょう。この後は、歩いておよそ7分、千畳閣へ向かいましょう。";

const SENJOKAKU_MEMO =
  "宮島桟橋から歩いておよそ7分、千畳閣(豊国神社)に着きます。天正15年(1587)、豊臣秀吉が安国寺恵瓊に命じて建立を始めた大経堂で、畳857枚分もの広さを持つ、現存する宮島最大の木造建築です。秀吉の死によって工事が中断し、天井板も張られないまま、今もその未完成の姿を残しています。明治の神仏分離により、もとの本尊は大願寺に移され、ここは秀吉と加藤清正を祀る豊国神社となりました。吹き抜けの広々とした空間を、柱の間を歩きながら眺めてみましょう。この後は、歩いてすぐ、五重塔へ向かいましょう。";

const GOJUNOTO_MEMO =
  "千畳閣から歩いてすぐ、五重塔に着きます。応永14年(1407)に建てられた、高さ27.6mの塔で、国の重要文化財に指定されています。和様に唐様を取り入れた建築で、朱塗りの外観が木々の緑に映えます。千畳閣の素朴な木組みとは対照的な、整った姿の塔を見比べてみましょう。この後は、歩いておよそ8分、紅葉谷公園へ向かいましょう。";

const DAIGANJI_MEMO =
  "大聖院から歩いておよそ6分、大願寺に着きます。真言宗の寺院で、本尊の厳島弁財天は、日本三大弁財天の一つに数えられるとされています。明治の神仏分離までは厳島神社の普請奉行として、神社の修理や造営を一手に担ってきました。護摩堂には、白檀でつくられた高さおよそ4mの不動明王像が安置されていて、平成18年(2006)に再建されたものです。このあたりには食事処も多いので、参拝のあとは、このあたりで昼食にしましょう。この後は、歩いておよそ1分、宮島歴史民俗資料館へ向かいましょう。";

const REKIMIN_MEMO =
  "大願寺から歩いてすぐ、宮島歴史民俗資料館に着きます。昭和49年(1974)に開館した資料館で、幕末から明治にかけて醤油醸造業で栄えた豪商・江上家の主屋と土蔵など、6棟の建物を活用しています。主屋は1800年代初めの建築で、国の登録有形文化財に指定されています。商家の暮らしぶりを伝える建物の中で、宮島の歴史や民俗に関する資料をじっくり見てみましょう。この後は、歩いておよそ3分、清盛神社へ向かいましょう。";

const KIYOMORI_MEMO =
  "宮島歴史民俗資料館から歩いておよそ3分、清盛神社に着きます。久安2年(1146)、安芸守に任じられた平清盛は、厳島神社を現在のような寝殿造り風の社殿に造営しました。清盛神社は、昭和29年(1954)、清盛の没後770年を記念して、それまで合祀されていた境外摂社「三翁神社」から分祀される形で創建されました。江戸時代に築かれた防波堤のような松原「西の松原」の中にあり、海を見渡せる静かな一角です。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ2分、宮島水族館へ向かいましょう。";

const AQUARIUM_MEMO =
  "清盛神社から歩いておよそ2分、宮島水族館(みやじマリン)に着きます。瀬戸内海の生き物を中心に、およそ380種を展示する水族館です。シンボルのスナメリをはじめ、カキいかだを再現した「カキ水槽」や、生き物に直接触れられる「ふれあいの磯」など、瀬戸内の自然を身近に感じられる展示が揃っています。館内をゆっくりめぐって、瀬戸内海の豊かな生き物たちを楽しみましょう。この後は、歩いておよそ2分、大元神社へ向かいましょう。";

const OMOTO_MEMO =
  "宮島水族館から歩いておよそ2分、今日の締めくくり、大元神社に着きます。厳島神社の摂社で、推古天皇の即位(593)に厳島神社が創建される以前からこの地にあったとも伝えられる、宮島でも特に古い歴史を持つ神社です。本殿の屋根は「大元葺」と呼ばれる、六枚重ね三段の柿葺という、日本で唯一現存するとされる珍しい様式で、国の重要文化財に指定されています。水族館のにぎわいから一転、静かな社殿の前で、今日めぐってきた宮島の一日を振り返ってみましょう。参拝の際は、敬意を込めて手を合わせましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const day1Id = "20c9abab-9eff-4390-bd30-b4d78e8cecb4";
  const day2Id = "2a556418-b293-432a-a2b2-4292f1aa458f";

  const taishoin = await findSpotInItinerary(itinId, { spotName: "大聖院" });
  const momijidani = await findSpotInItinerary(itinId, { spotName: "紅葉谷公園" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "千畳閣",
        address: "広島県廿日市市宮島町1-1",
        lat: 34.2973208,
        lng: 132.3202671,
        memo: SENJOKAKU_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 45,
      },
    },
    {
      create: {
        name: "五重塔",
        address: "広島県廿日市市宮島町1-1",
        lat: 34.2971947,
        lng: 132.3207385,
        memo: GOJUNOTO_MEMO,
        visitTime: t(9, 47),
        stayDurationMin: 15,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      id: momijidani.id,
      data: {
        memo: MOMIJIDANI_MEMO,
        visitTime: t(10, 9),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 7,
        transitLine: null,
      },
    },
    {
      id: taishoin.id,
      data: {
        memo: TAISHOIN_MEMO,
        lat: 34.2917287,
        lng: 132.3185775,
        visitTime: t(11, 7),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "大願寺",
        address: "広島県廿日市市宮島町3",
        lat: 34.2954699,
        lng: 132.318232,
        memo: DAIGANJI_MEMO,
        visitTime: t(12, 13),
        stayDurationMin: 80,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      create: {
        name: "宮島歴史民俗資料館",
        address: "広島県廿日市市宮島町57",
        lat: 34.2951501,
        lng: 132.3175505,
        memo: REKIMIN_MEMO,
        visitTime: t(13, 34),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 1,
        transitLine: null,
      },
    },
    {
      create: {
        name: "清盛神社",
        address: "広島県廿日市市宮島町西松原",
        lat: 34.2963772,
        lng: 132.3164232,
        memo: KIYOMORI_MEMO,
        visitTime: t(14, 27),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "宮島水族館",
        address: "広島県廿日市市宮島町10-3",
        lat: 34.2954755,
        lng: 132.3156513,
        memo: AQUARIUM_MEMO,
        visitTime: t(14, 49),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "大元神社",
        address: "広島県廿日市市宮島町大元公園",
        lat: 34.2946714,
        lng: 132.314085,
        memo: OMOTO_MEMO,
        visitTime: t(16, 21),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
  ];

  await prisma.$transaction(async (tx) => {
    // 紅葉谷公園はDay2からDay1へ移す(day跨ぎ)。先にdayIdだけ動かすと
    // 元のorder_noがDay1の既存スポットと衝突するため、9000番台へ退避
    // させてから、setDaySpotOrderの中で正式なorder_noを振り直す。
    await tx.spot.update({ where: { id: momijidani.id }, data: { dayId: day1Id, orderNo: 9001 } });
    await setDaySpotOrder(day1Id, day1Spots, { tx });
  }, { timeout: 30000 });
  console.log("COMMITTED (Day1のみ。Day2は企画運営への相談後に組む)");
}
main().finally(() => prisma.$disconnect());
