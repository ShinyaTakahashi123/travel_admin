/**
 * #118 8ba48819(白川郷)の組み直し。既存は荻町合掌造り集落・和田家・
 * 「城山天守閣展望台」の3か所(10:00〜13:00)のみだった。
 *
 * 「城山天守閣」は、展望台に隣接する民間の食事処・売店・カフェの
 * 施設名(昭和53年/1978築、個人経営)で、公共の展望スポットそのものの
 * 名前ではないことが分かったため、実際の地名である「荻町城跡展望台」
 * に直した(座標もOSMの点に修正)。
 *
 * 白川八幡神社・明善寺郷土館・神田家・長瀬家を追加し、荻町合掌造り
 * 集落→白川八幡神社→明善寺郷土館→神田家→長瀬家(昼食)→和田家→
 * 荻町城跡展望台、09:15〜16:47に組んだ。案内口調(「皆様」「お楽しみ
 * ください」「ご案内いたします」)も直した。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 白川八幡神社: 1200年以上続く奇祭「どぶろく祭」で知られる神社。
 *   神社の酒蔵でつくったどぶろくを神に奉納し、参加者にも振る舞われる。
 *   獅子舞・民謡は岐阜県指定重要無形民俗文化財: 検索結果各種
 *   (開催日は書かず「毎年秋」とした)
 * - 明善寺郷土館: 真宗大谷派の寺院・明善寺の庫裡(享和元年/1801建立の
 *   鐘楼門は茅葺きで岐阜県文化財、庫裡は江戸末期・1817年頃建立)を
 *   郷土資料館として公開: kankou-gifu.jp等
 * - 神田家: 160年以上の歴史を持つ合掌造りの民家、間取りの発達や
 *   小屋組み(合掌木)の完成度の高さで知られる: shirakawa-go.gr.jp等
 * - 長瀬家: 5階建ての合掌造り、1階に500年前の作と伝わる仏壇・美術品、
 *   3・4階に昔の生活用具を展示: shirakawa-go.gr.jp等
 * - 荻町城跡展望台: 集落を一望できる公共の展望スポット(OSM way/
 *   viewpoint種別で確認): 隣接して民間の食事処・売店・カフェ(城山
 *   天守閣)がある
 *
 * 昼食は長瀬家の滞在に組み込んだ(OSM確認: 集落周辺に食事処14件)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHUURAKU_MEMO =
  "高山濃飛バスセンターからバスでおよそ50分、今日はまず荻町合掌造り集落から始まります。平成7年(1995)に世界文化遺産に登録された、60棟ほどの合掌造り家屋が集まる集落です。17世紀末から江戸幕府の直轄支配下に置かれたこの地では、養蚕や、火薬の原料となる焔硝づくりを支えるため、急勾配の大きな屋根を持つ独特の家屋が生み出されました。田畑の広がる山あいに、合掌造りの家並みが連なる景色は、日本の原風景ともいえる趣です。多くの家屋は今も実際に人が暮らす住まいでもありますので、敷地に無断で立ち入ったり、窓の中をのぞき込んだりしないよう、マナーを守って見学しましょう。この後は、歩いておよそ6分、白川八幡神社へ向かいましょう。";

const HACHIMAN_MEMO =
  "荻町合掌造り集落から歩いておよそ6分、白川八幡神社に着きます。集落の鎮守として祀られてきた神社で、1200年以上続くと伝えられる奇祭「どぶろく祭」でも知られています。神社の酒蔵でつくられたどぶろくを神様に奉納し、参拝者にも振る舞われるお祭りで、獅子舞や民謡「こだいじん」が披露されます。これらの獅子舞・民謡は、岐阜県の指定重要無形民俗文化財に指定されています。毎年秋に行われるこのお祭りは、山里の信仰と暮らしを今に伝えています。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いてすぐ、明善寺郷土館へ向かいましょう。";

const MYOZENJI_MEMO =
  "白川八幡神社から歩いてすぐ、明善寺郷土館に着きます。集落の中でもひときわ目を引く、5階建ての合掌造りの寺院・明善寺の一部です。本堂から庫裡、鐘楼までがすべて合掌造りで建てられていて、珍しい茅葺きの鐘楼門は享和元年(1801)の建立で、岐阜県の文化財に指定されています。江戸時代末、1817年ごろに建てられた庫裡は、郷土資料館として一般公開されていて、山里の暮らしを伝える民具の数々を見ることができます。今も信仰の対象となっている寺院ですので、参拝の際は敬意を込めて手を合わせましょう。この後は、歩いておよそ3分、神田家へ向かいましょう。";

const KANDAKE_MEMO =
  "明善寺郷土館から歩いておよそ3分、神田家に着きます。160年以上の歴史を持つ合掌造りの民家で、間取りの発達や、小屋組み(合掌木)に見える大工の手跡の多さから、合掌造り家屋の中でも完成度が極めて高いとされています。囲炉裏端で代々受け継がれてきた暮らしの道具や、太い梁が組まれた屋根裏の構造を、間近で見学できます。この後は、歩いてすぐ、長瀬家へ向かいましょう。";

const NAGASEKE_MEMO =
  "神田家から歩いてすぐ、長瀬家に着きます。5階建ての大きな合掌造り家屋で、1階には500年前の作と伝わる荘厳な仏壇をはじめ、美術品や什器が並び、3階・4階には昔ながらの生活用具が展示されています。急な階段を上りながら、養蚕や焔硝づくりで栄えた旧家の暮らしぶりをたどってみましょう。このあたりには食事処も多いので、見学のあとは、このあたりでゆっくり昼食の時間をとりましょう。この後は、歩いておよそ5分、和田家へ向かいましょう。";

const WADAKE_FROM = "続いてご案内するのは和田家です。";
const WADAKE_TO = "長瀬家から歩いておよそ5分、和田家に着きます。";

const WADAKE_END_FROM = "見学のあとは、集落を一望できる城山天守閣展望台へとご案内いたします。";
const WADAKE_END_TO = "見学のあとは、車でおよそ10分、集落を一望できる荻町城跡展望台へ向かいましょう。";

const TENBODAI_MEMO =
  "和田家から車でおよそ10分、荻町城跡展望台に着きます。田畑の中に合掌造りの家並みが点在する荻町集落の全景を、高いところからゆったりと見渡せる、白川郷観光の記念撮影スポットです。すぐそばには、食事やお土産を扱う民間の施設もあり、休憩に立ち寄ることもできます。シャトルバスも運行されているので、集落散策で疲れた足でも気軽に訪れられます。集落を歩いて感じた合掌造りの息づかいを、高台から俯瞰する景色とあわせて、旅の締めくくりに味わいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const shuuraku = await findSpotInItinerary(itinId, { spotName: "荻町合掌造り集落" });
  const wadake = await findSpotInItinerary(itinId, { spotName: "和田家" });
  const tenbodai = await findSpotInItinerary(itinId, { spotName: "城山天守閣展望台" });

  if (!wadake.memo!.includes(WADAKE_FROM)) throw new Error("和田家の文言が想定外です");
  if (!wadake.memo!.includes(WADAKE_END_FROM)) throw new Error("和田家の結びが想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: shuuraku.id, data: { memo: SHUURAKU_MEMO, visitTime: t(9, 15), stayDurationMin: 100 } },
    {
      create: {
        name: "白川八幡神社",
        address: "岐阜県大野郡白川村荻町256",
        lat: 36.2548592,
        lng: 136.9056961,
        memo: HACHIMAN_MEMO,
        visitTime: t(11, 1),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      create: {
        name: "明善寺郷土館",
        address: "岐阜県大野郡白川村荻町679",
        lat: 36.2560433,
        lng: 136.9065999,
        memo: MYOZENJI_MEMO,
        visitTime: t(11, 28),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "神田家",
        address: "岐阜県大野郡白川村荻町796",
        lat: 36.257645,
        lng: 136.9074623,
        memo: KANDAKE_MEMO,
        visitTime: t(12, 28),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "長瀬家",
        address: "岐阜県大野郡白川村荻町823-2",
        lat: 36.2573428,
        lng: 136.9076652,
        memo: NAGASEKE_MEMO,
        visitTime: t(13, 4),
        stayDurationMin: 85,
        transitMode: "walk",
        transitDurationMin: 1,
        transitLine: null,
      },
    },
    {
      id: wadake.id,
      data: {
        memo: wadake.memo!.replace(WADAKE_FROM, WADAKE_TO).replace(WADAKE_END_FROM, WADAKE_END_TO),
        visitTime: t(14, 34),
        stayDurationMin: 40,
        transitDurationMin: 5,
      },
    },
    {
      id: tenbodai.id,
      data: {
        name: "荻町城跡展望台",
        memo: TENBODAI_MEMO,
        lat: 36.2629545,
        lng: 136.9079634,
        visitTime: t(15, 19),
        stayDurationMin: 80,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
