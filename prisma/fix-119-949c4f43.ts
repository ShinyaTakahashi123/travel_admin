/**
 * #119 949c4f43(ハウステンボス)の組み直し。企画運営の指示(16:02,16:14)
 * にもとづき、既存のパレスハウステンボス・ドムトールン(それぞれ1か所
 * のみの日だった)に、弓張岳展望台・海上自衛隊佐世保史料館(Day1)と、
 * 展海峰・石岳展望台・森きらら・九十九島パールシーリゾート・海きらら
 * (Day2)を追加した。ハウステンボス園内は、OSMで座標が確認できる
 * パレスハウステンボス・ドムトールンの2か所のみとし、それ以外の
 * パビリオン(座標の裏付けが取れなかった)は使っていない。
 *
 * Day1(弓張岳・史料館・ハウステンボス): 弓張岳展望台→海上自衛隊
 * 佐世保史料館→パレスハウステンボス(昼食)→ドムトールン、09:00〜16:33
 * Day2(九十九島エリア): 展海峰→石岳展望台→森きらら→九十九島
 * パールシーリゾート(遊覧船、昼食)→海きらら、09:00〜16:39
 *
 * 説明文は「花や光の演出とは違う、建築とパノラマ」から、実際の中身
 * (ハウステンボスの建築と九十九島の自然)にあわせて書き直した。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 弓張岳展望台: 標高364m、九十九島八景の一つ、俵ヶ浦半島を挟んで
 *   九十九島と佐世保市街地を一望、日本夜景100選: nagasaki-tabinet.com等
 * - 海上自衛隊佐世保史料館(セイルタワー): 旧日本海軍と海上自衛隊の
 *   歴史を解説、艦艇模型・史料展示、7階に展望ロビー、営業9:30〜17:00
 *   (最終入館16:30): mod.go.jp、jalan.net等
 * - 展海峰: 標高165m、昭和56年(1981)整備開始、九十九島を180度一望:
 *   ja.wikipedia.org、tabi-mag.jp等
 * - 石岳展望台: 標高191m、360度の眺望、映画「ラスト サムライ」冒頭の
 *   ロケ地とされる: nagasaki-tabinet.com等
 * - 森きらら(西海国立公園九十九島動植物園): 九十九島を見下ろす高台、
 *   ペンギン舎は日本最大級とされる天井水槽が特徴: ja.wikipedia.org等
 * - 九十九島パールシーリゾート・遊覧船パールクイーン: 白と木目調の
 *   バリアフリー遊覧船: sasebo99.com等
 * - 海きらら(九十九島水族館): 自然光が差し込む屋外水槽、イルカプール、
 *   営業時間は季節により9:00〜17:00または18:00(最終入館は閉館30分前):
 *   jalan.net等
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "ハウステンボスと九十九島、長崎の絶景と異国情緒を楽しむ1泊2日";
const DESCRIPTION =
  "オランダの街並みを再現したハウステンボスの宮殿建築と、大小208の島々が織りなす九十九島の絶景。異国情緒あふれる建物から、海を望む展望台や水族館までを楽しむ1泊2日です。";

const YUMIHARI_MEMO =
  "佐世保駅前でレンタカーを借りて、今日はまず弓張岳展望台から始まります。標高364mの山頂に広がる展望台で、「九十九島八景」のひとつに数えられています。俵ヶ浦半島を挟んで、西には五島灘に浮かぶ九十九島の島々、南には佐世保港、東には佐世保の市街地と、三方のパノラマを見渡せます。夜は米軍基地や造船所の灯りがオレンジ色に輝く光景が「日本夜景100選」に選ばれていますが、昼間は島々の輪郭をくっきりと望める爽快な眺めが魅力です。この後は、車でおよそ10分、海上自衛隊佐世保史料館へ向かいましょう。";

const SAIL_TOWER_MEMO =
  "弓張岳展望台から車でおよそ10分、海上自衛隊佐世保史料館(セイルタワー)に着きます。旧日本海軍から海上自衛隊に至る歴史を、艦艇の模型や史料でわかりやすく紹介する資料館です。6階から4階には旧海軍の歩み、3階と2階には海上自衛隊の活動に関する展示があり、精巧な艦艇模型の数々を間近で見られます。7階の展望ロビーからは、佐世保港を一望できます。この後は、車でおよそ23分、パレスハウステンボスへ向かいましょう。";

const PALACE_FROM = "皆様、本日ご案内するのはパレスハウステンボスです。";
const PALACE_TO = "海上自衛隊佐世保史料館から車でおよそ23分、パレスハウステンボスに着きます。";

const PALACE_END_FROM = "オランダ王室ゆかりの優美な建築と、館内の美術展示を、あわせてお楽しみください。今夜はこの近くの宿にご宿泊いただきます。";
const PALACE_END_TO =
  "オランダ王室ゆかりの優美な建築と、館内の美術展示を、あわせて味わいましょう。園内には食事処も多いので、見学のあとはこのあたりで昼食にしましょう。この後は、歩いておよそ5分、ドムトールンへ向かいましょう。";

const DOM_FROM = "旅の2日目にご案内するのはドムトールンです。";
const DOM_TO = "パレスハウステンボスから歩いておよそ5分、ドムトールンに着きます。";

const DOM_END_FROM =
  "異国の空気をまとった塔からの絶景を、ぜひお楽しみください。パレスハウステンボスとドムトールン、宮殿とタワーを楽しむ1泊2日をお楽しみいただけたことでしょう。";
const DOM_END_TO = "異国の空気をまとった塔からの絶景を、味わいましょう。今夜はこの近くの宿に泊まりましょう。";

const TENKAIHO_MEMO =
  "2日目は、宿泊先から車でおよそ30分、展海峰から始まります。標高165mの高台に昭和56年(1981)から整備された展望公園で、九十九島を180度見渡せます。大小208の島々が連なる九十九島は、佐世保港の外から北へおよそ25kmにわたって広がり、日本でも有数の島の密度とされています。春の菜の花、秋のコスモスなど、季節の花も楽しめる公園です。この後は、車でおよそ6分、石岳展望台へ向かいましょう。";

const ISHIDAKE_MEMO =
  "展海峰から車でおよそ6分、石岳展望台に着きます。標高191mの石岳の山頂にある展望スポットで、360度の眺望が広がります。ハリウッド映画「ラスト サムライ」の冒頭の場面が撮影された場所とも伝えられていて、九十九島の多島美を違う角度から楽しめます。この後は、車でおよそ2分、森きららへ向かいましょう。";

const MORIKIRARA_MEMO =
  "石岳展望台から車でおよそ2分、九十九島を見下ろす高台にある森きららに着きます。正式には「西海国立公園九十九島動植物園」といい、九十九島の自然と癒やしをテーマにした動植物園です。ペンギン舎には、日本最大級とされる天井水槽があり、頭上を泳ぐペンギンの姿を見上げられます。動物たちとふれあえる体験プログラムも充実していて、家族連れにも親しまれています。この後は、車でおよそ4分、九十九島パールシーリゾートへ向かいましょう。";

const PEARLSEA_MEMO =
  "森きららから車でおよそ4分、九十九島パールシーリゾートに着きます。遊覧船パールクイーンに乗り込み、九十九島の島々の間をめぐる、海からの絶景を楽しめる遊覧船です。白と木目を基調にした優雅な船体で、バリアフリーにも配慮されています。船上から眺める大小の島々と、入り組んだリアス海岸の景色は、陸からとはまた違う迫力です。このあたりには食事処もあるので、乗船の前後に昼食の時間をとりましょう。この後は、歩いてすぐ、海きららへ向かいましょう。";

const UMIKIRARA_MEMO =
  "九十九島パールシーリゾートから歩いてすぐ、この旅の締めくくり、海きらら(九十九島水族館)に着きます。九十九島の海に生きる生き物たちを紹介する水族館で、自然光が差し込む屋外の大水槽や、イルカのプールが見どころです。九十九島の多島海をイメージした展示を通して、海の生態系を身近に感じられます。九十九島の空から海の中までをめぐった、長崎の旅はこれで終わりです。レンタカーを返却して、帰りの電車や飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });

  if (!palace.memo!.includes(PALACE_FROM)) throw new Error("パレスハウステンボスの書き出しが想定外です");
  if (!palace.memo!.includes(PALACE_END_FROM)) throw new Error("パレスハウステンボスの結びが想定外です");
  if (!dom.memo!.includes(DOM_FROM)) throw new Error("ドムトールンの書き出しが想定外です");
  if (!dom.memo!.includes(DOM_END_FROM)) throw new Error("ドムトールンの結びが想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE, description: DESCRIPTION } });

    // ドムトールンは既存Day2からDay1へ移す(日をまたぐ移動)。先にdayIdだけ
    // 動かすと元のorder_noがDay1の既存スポットと衝突するため、9000番台へ
    // 退避させてから、setDaySpotOrderの中で正式なorder_noを振り直す。
    await tx.spot.update({ where: { id: dom.id }, data: { dayId: day1.id, orderNo: 9001 } });

    const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "弓張岳展望台",
        address: "長崎県佐世保市鵜渡越町570",
        lat: 33.1793625,
        lng: 129.7008186,
        memo: YUMIHARI_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 40,
      },
    },
    {
      create: {
        name: "海上自衛隊佐世保史料館",
        address: "長崎県佐世保市泉町8-1",
        lat: 33.1738249,
        lng: 129.7135187,
        memo: SAIL_TOWER_MEMO,
        visitTime: t(9, 50),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      id: palace.id,
      data: {
        memo: palace.memo!.replace(PALACE_FROM, PALACE_TO).replace(PALACE_END_FROM, PALACE_END_TO),
        visitTime: t(11, 13),
        stayDurationMin: 180,
        transitMode: "car",
        transitDurationMin: 23,
        transitLine: null,
      },
    },
    {
      id: dom.id,
      data: {
        memo: dom.memo!.replace(DOM_FROM, DOM_TO).replace(DOM_END_FROM, DOM_END_TO),
        visitTime: t(14, 18),
        stayDurationMin: 135,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];
    await setDaySpotOrder(day1.id, day1Spots, { tx });

    const day2Spots: SpotOrderItem[] = [
    {
      create: {
        name: "展海峰",
        address: "長崎県佐世保市赤崎町",
        lat: 33.1323347,
        lng: 129.692917,
        memo: TENKAIHO_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 60,
      },
    },
    {
      create: {
        name: "石岳展望台",
        address: "長崎県佐世保市船越町",
        lat: 33.1547727,
        lng: 129.6877187,
        memo: ISHIDAKE_MEMO,
        visitTime: t(10, 6),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      create: {
        name: "森きらら",
        address: "長崎県佐世保市船越町2172",
        lat: 33.1511908,
        lng: 129.6887117,
        memo: MORIKIRARA_MEMO,
        visitTime: t(10, 43),
        stayDurationMin: 120,
        transitMode: "car",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "九十九島パールシーリゾート",
        address: "長崎県佐世保市鹿子前町1008",
        lat: 33.1624548,
        lng: 129.6789408,
        memo: PEARLSEA_MEMO,
        visitTime: t(12, 47),
        stayDurationMin: 100,
        transitMode: "car",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "海きらら",
        address: "長崎県佐世保市鹿子前町1008",
        lat: 33.1611395,
        lng: 129.6791481,
        memo: UMIKIRARA_MEMO,
        visitTime: t(14, 29),
        stayDurationMin: 130,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
  ];
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 30000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
