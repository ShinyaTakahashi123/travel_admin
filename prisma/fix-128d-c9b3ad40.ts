/**
 * #128 c9b3ad40の直し(4回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営: 終了が16:28で、かつ「初詣は混むので長めに」という理由で
 * 各スポットの滞在を延ばしていたのが、出典もブログで公式でなく、
 * 決まりAの「時間を合わせるための延長」と同じ問題。滞在をふつうの
 * 見学の長さに戻し、空いた時間に実在の行き先(倭姫宮・神宮徴古館)を
 * 追加。混雑については滞在を延ばす理由にせず、「時間に余裕を持って」
 * という一文のみに留める。
 *
 * 法務: 内宮の「鰹木が6本」は誤り。Discover Japan(discoverjapan-web.com/
 * article/38807)によれば、内宮は10本、外宮は9本。「ぜひご注目ください」
 * も標準の言い方に修正。外宮の「内宮よりも早い時間帯から混み合う」は
 * 出典が確かめられないため削除。
 *
 * 新しい座標:
 * - 倭姫宮: 34.4852112, 136.7233418(OSM node 6470496188)
 * - 神宮徴古館: 34.487801, 136.721863(国土地理院、伊勢市神田久志本町
 *   1754-1の点、推定。倭姫宮と同じ「倭姫文化の森」エリア内)。
 *   開館時間9:00〜16:30(最終入館16:00)、休館は木曜・12/29〜12/31
 *   (神宮徴古館公式サイト museum.isejingu.or.jp で確認)
 *
 * 出典: 倭姫宮は大正12年創祀・14宮中最も新しいとkankomie.or.jp/spot/2934で、
 * 神宮徴古館の展示内容はkankomie.or.jp/spot/3135で確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FUTAMI_STAY = 45;

const GEKU_FROM = "初詣の時期は、内宮よりも早い時間帯から参拝者で混み合うことが知られています。御正宮をはじめ、別宮もあわせて、敬意を持って参拝しましょう。この後は、バスでおよそ25分、内宮へ向かいましょう。";
const GEKU_TO = "御正宮をはじめ、別宮もあわせて、敬意を持って参拝しましょう。初詣の時期はたいへん混み合うので、時間に余裕を持って訪れましょう。この後は、歩いておよそ8分、倭姫宮へ向かいましょう。";

const YAMATOHIME_MEMO =
  "外宮から歩いておよそ8分、倭姫宮に着きます。内宮の祭神・天照大御神を祀る場所を探し求めて諸国を巡ったと伝えられる倭姫命を祀る、皇大神宮の別宮です。大正12年(1923)に創建された、14ある別宮の中でも最も新しいとされるお宮です。緑に囲まれた静かな境内で、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、神宮徴古館へ向かいましょう。";

const CHOKOKAN_MEMO =
  "倭姫宮から歩いておよそ5分、神宮徴古館に着きます。式年遷宮のたびに新しくつくり替えられ、役目を終えた神宮の御神宝や装束をはじめ、美術工芸品、国の重要文化財に指定された考古・歴史資料などを展示する博物館です。20年に一度の式年遷宮という神宮ならではの仕組みと、そこに込められた技を間近に見ることができます。この後は、バスでおよそ15分、内宮へ向かいましょう。";

const NAIKU_OPENER_FROM = "外宮からバスでおよそ25分、伊勢神宮内宮に着きます。";
const NAIKU_OPENER_TO = "神宮徴古館からバスでおよそ15分、伊勢神宮内宮に着きます。";

const NAIKU_TYPO_FROM = "屋根の上の千木と鰹木の形にもぜひご注目ください。内宮は鰹木が6本、千木の先端が水平に切られているのが特徴で、これを覚えておくと外宮の社殿と見比べる楽しみが増えます。";
const NAIKU_TYPO_TO = "屋根の上の千木と鰹木の形にも注目してみましょう。内宮は鰹木が10本、千木の先端が水平に切られているのが特徴で、これを覚えておくと外宮の社殿と見比べる楽しみが増えます。";

const SARUTAHIKO_STAY = 70;

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;

  const futami = await findSpotInItinerary(itinId, { spotName: "二見興玉神社" });
  const geku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮外宮" });
  const naiku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮内宮" });
  const okage = await findSpotInItinerary(itinId, { spotName: "おかげ横丁" });
  const sarutahiko = await findSpotInItinerary(itinId, { spotName: "猿田彦神社" });

  if (!geku.memo?.includes(GEKU_FROM)) throw new Error("外宮の文言が想定外です");
  if (!naiku.memo?.includes(NAIKU_OPENER_FROM)) throw new Error("内宮の文言が想定外です(1)");
  if (!naiku.memo?.includes(NAIKU_TYPO_FROM)) throw new Error("内宮の文言が想定外です(2)");

  console.log("確認OK。dayId:", futami.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const naikuMemo = naiku.memo!.replace(NAIKU_OPENER_FROM, NAIKU_OPENER_TO).replace(NAIKU_TYPO_FROM, NAIKU_TYPO_TO);

  const items: SpotOrderItem[] = [
    { id: futami.id, data: { visitTime: t(8, 30), stayDurationMin: FUTAMI_STAY } },
    {
      id: geku.id,
      data: {
        memo: geku.memo!.replace(GEKU_FROM, GEKU_TO),
        visitTime: t(9, 40),
        stayDurationMin: 45,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 25, transitLine: null }] },
      },
    },
    {
      create: {
        name: "倭姫宮",
        memo: YAMATOHIME_MEMO,
        lat: 34.4852112,
        lng: 136.7233418,
        visitTime: t(10, 33),
        stayDurationMin: 35,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
      },
    },
    {
      create: {
        name: "神宮徴古館",
        memo: CHOKOKAN_MEMO,
        lat: 34.487801,
        lng: 136.721863,
        visitTime: t(11, 13),
        stayDurationMin: 60,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
      },
    },
    {
      id: naiku.id,
      data: {
        memo: naikuMemo,
        visitTime: t(12, 28),
        stayDurationMin: 90,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 15, transitLine: null }] },
      },
    },
    {
      id: okage.id,
      data: { visitTime: t(14, 13), stayDurationMin: 60 },
    },
    {
      id: sarutahiko.id,
      data: { visitTime: t(15, 21), stayDurationMin: SARUTAHIKO_STAY },
    },
  ];
  await setDaySpotOrder(futami.dayId, items, {});

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
