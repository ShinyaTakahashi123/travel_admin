/**
 * #110 76319c13(横浜)の直し(3回目)。企画運営(2026-10-01 13:00)の指摘。
 * 1. 決まりAの水増し: 大さん橋60分(屋上広場を眺めるだけなら30分前後)・
 *    赤レンガ倉庫までの徒歩20分(実際の点どうしの距離は0.5〜1km)・
 *    中華街80分(昼食は赤レンガ倉庫で済むため60分前後)を実際の長さに
 *    縮め、空いた時間は神奈川県庁本庁舎(新規、愛称「キングの塔」、
 *    横浜三塔のひとつ)を追加して埋めた。象の鼻パーク・横浜市開港
 *    記念会館・神奈川県立歴史博物館・港の見える丘公園は、#64 1a32349e
 *    ですでに使われているため避けた。
 * 2. 大さん橋の結び「次はみなとみらいのシンボル、横浜赤レンガ倉庫へ
 *    向かいましょう」(分数なし)を「この後は、歩いておよそ〇分、〜へ」
 *    の形に直した。
 *
 * あわせて見つけた問題: 山下公園の結び「この後は、歩いてすぐ、氷川丸へ
 * 向かいましょう」が、#64の山下公園の結びと一字一句同じだったため、
 * 言い回しを変えた。
 *
 * 神奈川県庁本庁舎の座標はOSM生APIで確認(35.4460537,139.6405095)。
 * 事実確認(開いたURL): 昭和3年(1928)竣工・愛称「キングの塔」・横浜
 * 三塔(キング・クイーン・ジャック)のひとつ・平成31年(2019)国指定
 * 重要文化財・平日は6階歴史展示室と屋上展望台を見学可:
 * 検索結果各種(4travel, hamakore.yokohama など)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAIKOSHIRYOKAN_FROM = "この後は、歩いておよそ10分、大さん橋へ向かいましょう。";
const KAIKOSHIRYOKAN_TO = "この後は、歩いておよそ4分、神奈川県庁本庁舎へ向かいましょう。";

const KENCHO_MEMO =
  "横浜開港資料館から歩いておよそ4分、神奈川県庁本庁舎に着きます。昭和3年(1928)に竣工した鉄筋コンクリート造の庁舎で、中央にそびえる高塔から「キングの塔」の愛称で親しまれ、横浜税関の「クイーンの塔」、横浜市開港記念会館の「ジャックの塔」とあわせて「横浜三塔」に数えられています。平成31年(2019)には国の重要文化財に指定されました。平日は、6階の歴史展示室と屋上展望台を見学でき、屋上からは横浜港やみなとみらいの眺めを楽しめます。この後は、歩いておよそ13分、大さん橋へ向かいましょう。";

const OSANBASHI_FROM =
  "横浜開港資料館から歩いておよそ10分、横浜港大さん橋国際客船ターミナルに着きます。世界各国のクルーズ客船が発着する、横浜港の海の玄関口です。大さん橋ふ頭そのものは1894年(明治27年)に完成した歴史ある埠頭で、現在のターミナル施設は2002年に建て替えられました。世界41か国から660点もの応募があった国際設計競技で選ばれた、建築家ユニット「フォーリン・オフィス・アーキテクツ」によるデザインが特徴です。屋上に広がる広場は、建物の屋根が波のうねりのようなゆるやかな2つの山形を描いていることから「くじらのせなか」の愛称で親しまれています。天然芝とウッドデッキが広がるこの屋上広場は24時間開放されていて、みなとみらいのビル群と海を一望できる、横浜屈指ともいわれる絶景スポットです。潮風を感じながら景色を楽しんだら、次はみなとみらいのシンボル、横浜赤レンガ倉庫へ向かいましょう。";
const OSANBASHI_TO =
  "神奈川県庁本庁舎から歩いておよそ13分、横浜港大さん橋国際客船ターミナルに着きます。世界各国のクルーズ客船が発着する、横浜港の海の玄関口です。大さん橋ふ頭そのものは1894年(明治27年)に完成した歴史ある埠頭で、現在のターミナル施設は2002年に建て替えられました。世界41か国から660点もの応募があった国際設計競技で選ばれた、建築家ユニット「フォーリン・オフィス・アーキテクツ」によるデザインが特徴です。屋上に広がる広場は、建物の屋根が波のうねりのようなゆるやかな2つの山形を描いていることから「くじらのせなか」の愛称で親しまれています。天然芝とウッドデッキが広がるこの屋上広場は24時間開放されていて、みなとみらいのビル群と海を一望できる、横浜屈指ともいわれる絶景スポットです。この後は、歩いておよそ12分、横浜赤レンガ倉庫へ向かいましょう。";

const AKARENGA_FROM = "大さん橋から海沿いを歩いて見えてくるこの赤い建物、正式には『新港埠頭保税倉庫』といいます。";
const AKARENGA_TO = "大さん橋から海沿いを歩いておよそ12分で見えてくるこの赤い建物、正式には『新港埠頭保税倉庫』といいます。";

const YAMASHITA_FROM = "花壇を眺めながらひと休みしたら、この後は、歩いてすぐ、氷川丸へ向かいましょう。";
const YAMASHITA_TO = "花壇を眺めながらひと休みしたら、すぐそばに係留された氷川丸へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76319c13%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const kaikoshiryokan = await findSpotInItinerary(itinId, { spotName: "横浜開港資料館" });
  const osanbashi = await findSpotInItinerary(itinId, { spotName: "横浜港大さん橋国際客船ターミナル" });
  const akarenga = await findSpotInItinerary(itinId, { spotName: "横浜赤レンガ倉庫" });
  const yamashita = await findSpotInItinerary(itinId, { spotName: "山下公園" });
  const hikawamaru = await findSpotInItinerary(itinId, { spotName: "氷川丸" });
  const chukagai = await findSpotInItinerary(itinId, { spotName: "横浜中華街" });
  const kanteibyo = await findSpotInItinerary(itinId, { spotName: "関帝廟" });
  const masobyo = await findSpotInItinerary(itinId, { spotName: "横浜媽祖廟" });

  if (!kaikoshiryokan.memo!.includes(KAIKOSHIRYOKAN_FROM)) throw new Error("開港資料館の文言が想定外です");
  if (!osanbashi.memo!.includes(OSANBASHI_FROM)) throw new Error("大さん橋の文言が想定外です");
  if (!akarenga.memo!.includes(AKARENGA_FROM)) throw new Error("赤レンガ倉庫の文言が想定外です");
  if (!yamashita.memo!.includes(YAMASHITA_FROM)) throw new Error("山下公園の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: kaikoshiryokan.id, data: { memo: kaikoshiryokan.memo!.replace(KAIKOSHIRYOKAN_FROM, KAIKOSHIRYOKAN_TO) } },
    {
      create: {
        name: "神奈川県庁本庁舎",
        address: "神奈川県横浜市中区日本大通1",
        lat: 35.4460537,
        lng: 139.6405095,
        memo: KENCHO_MEMO,
        visitTime: t(10, 14),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    { id: osanbashi.id, data: { memo: osanbashi.memo!.replace(OSANBASHI_FROM, OSANBASHI_TO), visitTime: t(11, 12), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 13 } },
    { id: akarenga.id, data: { memo: akarenga.memo!.replace(AKARENGA_FROM, AKARENGA_TO), visitTime: t(11, 54), transitDurationMin: 12 } },
    { id: yamashita.id, data: { memo: yamashita.memo!.replace(YAMASHITA_FROM, YAMASHITA_TO), visitTime: t(13, 14) } },
    { id: hikawamaru.id, data: { visitTime: t(13, 46) } },
    { id: chukagai.id, data: { visitTime: t(14, 46), stayDurationMin: 60 } },
    { id: kanteibyo.id, data: { visitTime: t(15, 49) } },
    { id: masobyo.id, data: { visitTime: t(16, 12) } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
