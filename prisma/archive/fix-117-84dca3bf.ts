/**
 * #117 84dca3bf(上高地・河童橋)の組み直し。既存は河童橋1か所
 * (09:30〜10:30ごろ)のみだったため、大正池・田代池・ウェストン碑・
 * 明神池と穂高神社奥宮を追加した。上高地はマイカー規制のため、沢渡・
 * 平湯からバスかタクシーで大正池バス停まで入り、大正池→田代池→
 * ウェストン碑→(河童橋を通って)明神池・穂高神社奥宮→(歩いて戻り)
 * 河童橋、という梓川沿いの定番の散策路をたどる形にした。
 * 河童橋の既存文も案内口調を直した。
 *
 * 09:00〜16:35、昼食は明神池・穂高神社奥宮の滞在(12:40〜13:50)に
 * 組み込んだ(食事処はごく少数のため、具体的な店名は出さず控えめに
 * 記載)。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 大正池: 大正4年(1915)6月の焼岳大噴火で梓川が泥流によりせき止め
 *   られ一夜にして誕生、当時は南北1540m・面積40ha、現在は面積が
 *   半分以下に縮小、立ち枯れの木々が残る: visitmatsumoto.com、
 *   ja.wikipedia.org等
 * - 田代池: 八右衛門沢などの土砂で流れがせき止められてできた浅い池、
 *   霞沢岳・六百山の伏流水が湧き水として溜まり、冬も全面結氷しない、
 *   ウェストンが大正3年(1914)上高地を去る最後の日に訪れた場所:
 *   kamikochi.or.jp等
 * - ウェストン碑: 昭和12年(1937)日本山岳会が梓川のほとりの巨岩に
 *   ウォルター・ウェストンのレリーフを設置、戦時中に取り外され昭和
 *   22年(1947)に復旧: mlit.go.jp、kamikochi.or.jp等
 * - 明神池・穂高神社奥宮: 明神岳の麓、穂高神社の神域内にある池。
 *   祭神は穂高見命(北アルプスの総鎮守)、毎年秋に「お船祭り」が
 *   行われる: kamikochi.or.jp等(開催日は書かず「毎年秋」とした)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAISHOIKE_MEMO =
  "沢渡か平湯でバスかタクシーに乗り換え、今日はまず大正池から上高地の散策を始めます。大正4年(1915)6月の焼岳大噴火で、噴き出した泥流が梓川をせき止め、一夜にして誕生した池です。できた当初は南北1540m、面積40haほどありましたが、100年あまりが過ぎた今は土砂の堆積で半分以下の広さになりました。池に立つ立ち枯れの木々は、噴火で水没した樹木の名残で、焼岳や穂高連峰の姿を映す水面とあわせて、幻想的な風景をつくり出しています。この後は、歩いておよそ20分、田代池へ向かいましょう。";

const TASHIROIKE_MEMO =
  "大正池から歩いておよそ20分、田代池に着きます。霞沢岳や六百山の伏流水が湧き水となって溜まる、浅くて穏やかな池です。八右衛門沢などから運ばれた土砂で梓川の流れがせき止められてでき、池の中にはいくつもの小島が点在しています。湧き水に支えられているため、真冬でも全面結氷しないのが特徴です。日本に近代登山を広めた英国人宣教師ウォルター・ウェストンが、大正3年(1914)に上高地を去る最後の日に訪れた場所としても知られています。この後は、歩いておよそ25分、ウェストン碑へ向かいましょう。";

const WESTON_MEMO =
  "田代池から歩いておよそ25分、ウェストン碑に着きます。梓川のほとりに立つ大きな岩に、ウォルター・ウェストンの横顔を刻んだレリーフが掛けられています。ウェストンは、著書『日本アルプスの登山と探検』で上高地や日本アルプスの魅力を世界に紹介し、「日本近代登山の父」とも呼ばれる人物です。このレリーフは昭和12年(1937)、日本山岳会によって設置されましたが、戦時中に取り外しを余儀なくされ、昭和22年(1947)に復旧しました。この後は、河童橋を通り抜け、歩いておよそ70分、明神池・穂高神社奥宮へ向かいましょう。";

const MYOJINIKE_MEMO =
  "ウェストン碑から、河童橋を通り抜けて歩いておよそ70分、明神池と穂高神社奥宮に着きます。明神岳のふもと、穂高神社の神域とされる池のほとりに、奥宮の社殿が鎮座しています。祭神の穂高見命は、北アルプス一帯の総鎮守とされる神様です。毎年秋には、龍や鷁をかたどった2隻の船を池に浮かべ、山の安全を祈る「お船祭り」が行われます。参拝の際は、敬意を込めて手を合わせましょう。このあたりには食事処もわずかながらあるので、ここで昼食にしましょう。この後は、歩いておよそ50分、河童橋へ戻りましょう。";

const KAPPABASHI_FROM = "皆様、河童橋へようこそ。梓川に架かるこの吊り橋は、上高地のシンボルとして親しまれています。";
const KAPPABASHI_TO = "明神池・穂高神社奥宮から歩いておよそ50分、再び河童橋に戻ってきます。梓川に架かるこの吊り橋は、上高地のシンボルとして親しまれています。";

const KAPPABASHI_END_FROM =
  "上高地は国立公園の特別な自然保護区域ですので、決められた道を歩きながら、この絶景をどうぞごゆっくりお楽しみください。なお、上高地は冬季は閉鎖されるため、お出かけ前に最新情報をご確認ください。";
const KAPPABASHI_END_TO =
  "上高地は国立公園の特別な自然保護区域ですので、決められた道を歩きながら、この絶景をゆっくり味わいましょう。今日歩いた道のりを振り返りながら、橋のたもとで最後のひとときを過ごしたら、バスターミナルから沢渡か平湯行きのバスで帰りましょう。なお、上高地は冬季は閉鎖されるため、お出かけ前に最新情報をご確認ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '84dca3bf%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const kappabashi = await findSpotInItinerary(itinId, { spotName: "河童橋" });

  if (!kappabashi.memo!.includes(KAPPABASHI_FROM)) throw new Error("河童橋の書き出しが想定外です");
  if (!kappabashi.memo!.includes(KAPPABASHI_END_FROM)) throw new Error("河童橋の結びが想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "大正池",
        address: "長野県松本市安曇上高地",
        lat: 36.2287261,
        lng: 137.6186512,
        memo: TAISHOIKE_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 60,
      },
    },
    {
      create: {
        name: "田代池",
        address: "長野県松本市安曇上高地",
        lat: 36.2357143,
        lng: 137.6245487,
        memo: TASHIROIKE_MEMO,
        visitTime: t(10, 20),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      create: {
        name: "ウェストン碑",
        address: "長野県松本市安曇上高地",
        lat: 36.2470302,
        lng: 137.6266555,
        memo: WESTON_MEMO,
        visitTime: t(11, 15),
        stayDurationMin: 15,
        transitMode: "walk",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
    {
      create: {
        name: "明神池・穂高神社奥宮",
        address: "長野県松本市安曇上高地",
        lat: 36.2540049,
        lng: 137.6640105,
        memo: MYOJINIKE_MEMO,
        visitTime: t(12, 40),
        stayDurationMin: 70,
        transitMode: "walk",
        transitDurationMin: 70,
        transitLine: null,
      },
    },
    {
      id: kappabashi.id,
      data: {
        memo: kappabashi.memo!.replace(KAPPABASHI_FROM, KAPPABASHI_TO).replace(KAPPABASHI_END_FROM, KAPPABASHI_END_TO),
        visitTime: t(14, 40),
        stayDurationMin: 115,
        transitMode: "walk",
        transitDurationMin: 50,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
