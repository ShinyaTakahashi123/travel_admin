/**
 * #111 76714b9fの直し(5回目)。企画運営(10/1 14:52)の指摘4点に対応。
 * 1. 魚志楼(営業中の1軒の料理屋)を行き先から外す決まりに反するため削除。
 *    昼食は旧森田銀行本店の滞在に組み込み、「このあたりの食事処で昼食に」
 *    という書き方にした(OSM確認: 三国湊の旧市街のbboxに食事処3件)。
 *    代わりの公共施設(マチノクラ)はOSM/Nominatimで点が見つからず、
 *    座標の裏付けができないため使わなかった。
 * 2. 丸岡城の書き出しに、宿(あわら温泉)からの車の時間(およそ20分)を追加
 * 3. レンタカーの乗り捨て(JR芦原温泉駅で借りて福井駅で返す)について、
 *    雄島の書き出しに一言追加
 * 4. 雄島の「越前海岸で最も大きな島」を「〜とされ」にぼかす
 *
 * 魚志楼の削除にともない、Day1の並び・時刻を組み直した。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OSHIMA_MEMO =
  "この旅は、JR芦原温泉駅でレンタカーを借りて、雄島から始まります(福井駅での乗り捨てができる店を選びましょう)。東尋坊から車ですぐ、およそ1200万年前に噴き出した安山岩でできた、越前海岸で最も大きな島とされ、朱塗りの雄島橋を渡って島に入ると、そこは大湊神社の鎮守の森で、島全体が神域とされています。大湊神社は、およそ1370年前の創建と伝えられる古社で、朝倉義景や明智光秀も参詣したと伝えられるほど、古くから航海や漁業の守り神として崇敬されてきました。「神の島」とも呼ばれ、島を包む木々の静けさと、周囲に広がる日本海の景色が織りなす独特の雰囲気が、多くの人を引きつけています。今も参拝の対象となっている神域ですので、静かに、敬意をもって島内を歩きましょう。この後は、車でおよそ8分、越前松島へ向かいましょう。";

const MORITAGINKO_MEMO =
  "旧岸名家から歩いておよそ3分、旧森田銀行本店に着きます。三国湊の豪商だった森田家が大正時代に設立した銀行の建物で、福井県内で最も古い鉄筋コンクリート造の建築とされています。洋風の外観が、格子戸が連なる三国湊の町並みの中でひときわ目を引く存在です。旧岸名家とあわせて「三國湊レトロ」と呼ばれるエリアの中心となっていて、北前船で栄えた港町が、やがて近代的な商業都市へと姿を変えていった歴史を物語っています。このあたりには食事処もいくつかあるので、見学を終えたら昼食にしましょう。この後は、歩いておよそ6分で車を停めた場所まで戻り、瀧谷寺まで車でおよそ5分向かいましょう。";

const TAKIDANJI_FROM = "魚志楼から、車に戻って瀧谷寺まで、あわせておよそ11分。瀧谷寺に着きます。";
const TAKIDANJI_TO = "旧森田銀行本店から、車に戻って瀧谷寺まで、あわせておよそ11分。瀧谷寺に着きます。";

const MARUOKAJO_MEMO =
  "2日目は、宿泊したあわら温泉から車でおよそ20分、丸岡城から始まります。北陸で唯一の現存天守を持つ城で、天正4年(1576)、柴田勝家の甥・柴田勝豊によって築かれたと伝えられています。現存する天守は寛永元年(1624)ごろに建てられたとされる木造建築で、屋根には、福井県で産出される笏谷石を加工した石瓦が使われているのが特徴です。かつては現存天守の中で最も古いとされていましたが、近年の調査で江戸時代初期の建築であることがわかりました。独立式望楼型2重3階の天守からは、坂井平野ののどかな景色を見渡せます。この後は、歩いてすぐ、一筆啓上日本一短い手紙の館へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76714b9f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const oshima = await findSpotInItinerary(itinId, { spotName: "雄島" });
  const matsushima = await findSpotInItinerary(itinId, { spotName: "越前松島" });
  const mikunijinja = await findSpotInItinerary(itinId, { spotName: "三國神社" });
  const kishinake = await findSpotInItinerary(itinId, { spotName: "旧岸名家" });
  const moritaginko = await findSpotInItinerary(itinId, { spotName: "旧森田銀行本店" });
  const uoshiro = await findSpotInItinerary(itinId, { spotName: "魚志楼" });
  const takidanji = await findSpotInItinerary(itinId, { spotName: "瀧谷寺" });
  const ryushokan = await findSpotInItinerary(itinId, { spotName: "みくに龍翔館" });
  const yunomachi = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });
  const maruokajo = await findSpotInItinerary(itinId, { spotName: "丸岡城" });

  if (!takidanji.memo!.includes(TAKIDANJI_FROM)) throw new Error("瀧谷寺の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: oshima.id, data: { memo: OSHIMA_MEMO } },
    { id: matsushima.id, data: {} },
    { id: mikunijinja.id, data: {} },
    { id: kishinake.id, data: {} },
    {
      id: moritaginko.id,
      data: { memo: MORITAGINKO_MEMO, stayDurationMin: 70 },
    },
    {
      id: takidanji.id,
      data: { memo: takidanji.memo!.replace(TAKIDANJI_FROM, TAKIDANJI_TO), visitTime: t(13, 32) },
    },
    { id: ryushokan.id, data: { visitTime: t(14, 26) } },
    { id: yunomachi.id, data: { visitTime: t(15, 21) } },
  ];

  await setDaySpotOrder(day1.id, day1Spots, { remove: [uoshiro.id] });
  await prisma.spot.update({ where: { id: maruokajo.id }, data: { memo: MARUOKAJO_MEMO } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
