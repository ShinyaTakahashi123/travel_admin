/**
 * #106 6ba2fc04(天橋立)の直し。企画運営(2026-10-01 12:57)の指摘2点。
 * 1. #78 c5aee4db・#85 8e5d82be と、天橋立(丹後国風土記の伝説部分)・
 *    丹後由良(山椒大夫・汐汲浜の部分)が、ほぼ同じ文章だった。両方の
 *    実際の本文を確認し、同じ事実を扱いながら文章・構成を書き分けた。
 *    加悦鉄道資料館(加悦SL広場2020年閉園の部分)も#78とほぼ同じ文章
 *    だったため、あわせて書き分けた。
 * 2. 加悦鉄道資料館96分は決まりAの水増し。実際の見学の長さ(35分)に
 *    縮め、空いた時間は加悦椿文化資料館(新規)を追加して埋めた。
 *    あわせて、どの既存スポットにも欠けていた「〜から〜分、…に着き
 *    ます」の書き出しを、天橋立・丹後由良・加悦鉄道資料館に補った。
 *
 * 加悦椿文化資料館の座標: 住所(京都府与謝郡与謝野町字滝1986)をGSI
 * 住所検索にかけたところ、大字「滝」レベルの点(35.472462,135.060715)
 * が返ってきた。番地までの一致は得られなかったが、現時点でこの住所に
 * ついて得られる最も精度の高い実在の値として採用する(#105人穴などと
 * 同じ考え方)。
 *
 * 事実確認(開いたURL): 加悦椿文化資料館(ツバキの花弁をかたどった外観・
 * 「千年ツバキの里」のシンボル・ツバキをテーマにした絵画や書、陶磁器の
 * 展示・開館9:00〜17:00): https://yosano-kankou.net/kankou/tubakishiryokan/ ,
 * https://www.town.yosano.lg.jp/facility-info/leisure-sightseeing-hotel/tourist-facility/414/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YURA_MEMO =
  "伊根の舟屋から車でおよそ20分、丹後由良に着きます。若狭湾に面したこの浜は、森鷗外の小説『山椒大夫』の舞台とされる地です。人買いにさらわれた姉弟・安寿と厨子王が、この地の長者・山椒大夫のもとで苦役を強いられたという物語が伝わっています。浜の西側には、幼い安寿が来る日も来る日も海水を汲んで運ばされたという「汐汲浜」が今も残り、物語の悲しい記憶をとどめています。ここで昼食にしましょう。この後は、車でおよそ15分、天橋立へ向かいましょう。";

const AMANOHASHIDATE_MEMO =
  "丹後由良から車でおよそ15分、天橋立に着きます。傘松公園で股のぞきの「昇龍観」を楽しんだあとは、実際に渡ってみましょう。白砂に黒松が連なる全長およそ3.6kmの砂州で、安芸の宮島・陸奥の松島とともに日本三景の一つとされています。その成り立ちについて『丹後国風土記』は、伊弉諾尊(イザナギノミコト)が天への通い路として架けた梯子が、寝ている間に倒れて海に横たわり、今の姿になったと伝えています。砂州の中ほどまで歩き、股の間から振り返ると、天と海が入れ替わって見える不思議な眺めを味わえます。この後は、車でおよそ25分、加悦椿文化資料館へ向かいましょう。";

const TSUBAKI_MEMO =
  "天橋立から車でおよそ25分、加悦椿文化資料館に着きます。ツバキの花びらをかたどったユニークな外観で、「千年ツバキの里」とも呼ばれるこの地域のシンボルになっている資料館です。館内には、ツバキをテーマにした絵画や書、陶磁器などが展示されています。この後は、車でおよそ10分、旧加悦鉄道加悦駅舎(加悦鉄道資料館)へ向かいましょう。";

const KAYAEKISHA_MEMO =
  "加悦椿文化資料館から車でおよそ10分、旧加悦鉄道加悦駅舎(加悦鉄道資料館)に着きます。大正15年(1926)、私鉄・加悦鉄道の開業にあわせて建てられた木造洋風の駅舎です。駅前には、かつて実際に使われていた腕木式信号機や、なつかしい形の郵便ポストも残されています。車両を展示していた「加悦SL広場」は2020年に閉園しましたが、駅舎は「加悦鉄道資料館」として、令和3年(2021)のリニューアルを経て今も公開が続けられており、NPO法人とボランティアによって大切に守られています。この後は、歩いておよそ5分、ちりめん街道へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const kasamatsu = await findSpotInItinerary(itinId, { spotName: "傘松公園" });
  const ine = await findSpotInItinerary(itinId, { spotName: "伊根の舟屋" });
  const yura = await findSpotInItinerary(itinId, { spotName: "丹後由良" });
  const amanohashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  const kayaekisha = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: kasamatsu.id, data: {} },
    { id: ine.id, data: {} },
    { id: yura.id, data: { memo: YURA_MEMO } },
    { id: amanohashidate.id, data: { memo: AMANOHASHIDATE_MEMO } },
    {
      create: {
        name: "加悦椿文化資料館",
        address: "京都府与謝郡与謝野町字滝1986",
        lat: 35.472462,
        lng: 135.060715,
        memo: TSUBAKI_MEMO,
        visitTime: t(14, 29),
        stayDurationMin: 42,
        transitMode: "car",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
    { id: kayaekisha.id, data: { memo: KAYAEKISHA_MEMO, visitTime: t(15, 21), stayDurationMin: 35, transitMode: "car", transitDurationMin: 10 } },
    { id: chirimen.id, data: { visitTime: t(16, 1) } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
