/**
 * #96 38dec57e 企画運営(2026-10-01 06:35)の指摘2点。
 * 1) メリケンパーク130分は水増しだった。公園自体は40分にし、空いた時間は
 *    実在の行き先(神戸ポートタワー・神戸海洋博物館・神戸港震災メモリアル
 *    パーク、いずれも新規・同じ港一帯にある)で埋めた。夜の案内の一言は、
 *    最後のスポット(神戸港震災メモリアルパーク)に移した。
 * 2) 「楽しむのもおすすめです」(宣伝口調)を「〜の夜景も見られます」に。
 *
 * 開いたURL:
 * - 神戸ポートタワー(開業年・形状・2024年リニューアル): feel KOBE公式
 *   https://www.feel-kobe.jp/column/renew0426_kobeporttower/
 * - 神戸海洋博物館(開館年・テーマ・カワサキワールド): 神戸ウォーター
 *   フロント開発機構 https://www.waterfront.or.jp/portmuseum/museum/view/86
 * - 神戸港震災メモリアルパーク(開設年・保存岸壁・展示): 神戸市公式
 *   https://www.city.kobe.lg.jp/z/kowankyoku/kanko/leisure/harbor/kankou/memorialpark.html
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MERIKEN_MEMO =
  "神戸市立博物館から歩いておよそ8分、メリケンパークに着きます。「メリケン」はアメリカのことで、外国人居留地の西端にアメリカ領事館があったことが名の由来です。芝生の広場から神戸港を望むことができ、平成29年(2017)、神戸開港150年を記念して設置された「BE KOBE」モニュメントもあります。阪神・淡路大震災から20年を機に生まれた「神戸の魅力は人である」という思いが込められています。この後は、歩いておよそ4分、神戸ポートタワーへ向かいましょう。";

const TOWER_MEMO =
  "メリケンパークから歩いておよそ4分、神戸ポートタワーに着きます。昭和38年(1963)に開業した、神戸のシンボルタワーです。鼓を縦に伸ばしたような姿が特徴で、令和6年(2024)のリニューアルでは、屋上に新しい展望デッキが設けられました。展望室やデッキからは、神戸港や市街地、六甲山系の眺めを楽しめます。この後は、歩いておよそ2分、神戸海洋博物館へ向かいましょう。";

const MARITIME_MEMO =
  "神戸ポートタワーから歩いておよそ2分、神戸海洋博物館に着きます。神戸開港120年を記念して昭和62年(1987)に開館した博物館で、「神戸とみなとのあゆみ」をテーマに、神戸港の発展の歴史や、船や港の仕組み・役割を紹介しています。館内では、川崎重工業の企業博物館「カワサキワールド」もあわせて楽しめます。この後は、歩いておよそ3分、神戸港震災メモリアルパークへ向かいましょう。";

const MEMORIAL_MEMO =
  "神戸海洋博物館から歩いておよそ3分、神戸港震災メモリアルパークに着きます。平成9年(1997)7月に開設された公園で、阪神・淡路大震災で被害を受けたメリケン波止場の岸壁の一部、およそ60メートルが、当時のまま保存されています。大きく傾いた街灯やひび割れた岸壁から、地震の大きさを今に伝えています。展示施設では、神戸港が受けた被害と復興の過程を、模型や映像、写真パネルで紹介しています。犠牲になった方々に思いを寄せながら、静かに見学しましょう。神戸の旅は、ここで終わりです。夜には、旧居留地やメリケンパーク周辺で「神戸ルミナリエ」が開かれることがあります(開催時期・点灯時間は公式サイトで確かめましょう)。六甲山やビーナスブリッジからは、神戸の夜景も見られます。お帰りは、三宮駅・元町駅など、最寄り駅からご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '38dec57e%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const kitano = await findSpotInItinerary(itinId, { spotName: "北野異人館街" });
  const ikuta = await findSpotInItinerary(itinId, { spotName: "生田神社" });
  const nankin = await findSpotInItinerary(itinId, { spotName: "南京町" });
  const museum = await findSpotInItinerary(itinId, { spotName: "神戸市立博物館" });
  const meriken = await findSpotInItinerary(itinId, { spotName: "メリケンパーク" });

  const day1Spots: SpotOrderItem[] = [
    { id: kitano.id, data: {} },
    { id: ikuta.id, data: {} },
    { id: nankin.id, data: {} },
    { id: museum.id, data: {} },
    { id: meriken.id, data: { memo: MERIKEN_MEMO, stayDurationMin: 40 } },
    {
      create: {
        name: "神戸ポートタワー",
        address: "兵庫県神戸市中央区波止場町",
        lat: 34.6826278,
        lng: 135.1867241,
        memo: TOWER_MEMO,
        visitTime: t(15, 6),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "神戸海洋博物館",
        address: "兵庫県神戸市中央区波止場町",
        lat: 34.6829503,
        lng: 135.1884501,
        memo: MARITIME_MEMO,
        visitTime: t(15, 43),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "神戸港震災メモリアルパーク",
        address: "兵庫県神戸市中央区波止場町",
        lat: 34.6837551,
        lng: 135.1901334,
        memo: MEMORIAL_MEMO,
        visitTime: t(16, 21),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- メリケンパーク以降 ---");
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt) { console.log("(visitTime未変更)"); continue; }
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
