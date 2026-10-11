/**
 * #132 d45c6b3bの直し(3回目)。法務(記録ee6be44)の指摘2点+企画運営の
 * 指摘(滞在短縮・白石方面への追加)。
 *
 * 法務の指摘:
 * ① 刈田嶺神社奥宮「享保3年(1721)」の和暦・西暦が合っていなかった。
 *    pref.miyagi.jp/soshiki/bunkazai/34kattamine.htmlを開いて確認し、
 *    享保3年は1718年が正しいため「享保3年(1718)」に修正。
 * ② 座標2か所:
 *    - 蔵王エコーライン: 38.136634,140.345493は山形側の区間(w107447261)
 *      の中心で、本文の「遠刈田温泉から…宮城側」から15km離れていた。
 *      宮城側の区間(w568613940の中心、38.136326,140.515704、
 *      api.openstreetmap.org/api/0.6/way/568613940/fullで確認)に修正。
 *    - 刈田嶺神社奥宮: 38.129,140.444(推定の仮値)を、実際の建物
 *      (w854811460の中心、38.127763,140.448083、同様に確認)に修正。
 *
 * 企画運営の指摘:
 * - 御釜(90分)+刈田嶺神社奥宮(90分)=180分は、隣接する2か所で時間
 *   合わせに見えるため、合わせて80分(御釜45分・奥宮35分)に短縮。
 * - 白石方面に足を延ばす案のうち、弥治郎こけし村(遠刈田・鳴子・土湯と
 *   並ぶ宮城伝統こけしの系統の一つだが遠刈田とは別系統、既存の
 *   8a15b42c・5f3f7bd0が使う「みやぎ蔵王こけし館」(遠刈田系)とは
 *   重ならないことを確認)を追加。座標はOSMに見つからず、国土地理院
 *   の「宮城県白石市福岡八宮」の地名点(140.527512,38.052368、推定)
 *   を使用。
 *
 * 【企画運営への申し送り】白石城・武家屋敷(旧小関家)は、既存の
 * 8a15b42c(キツネと動物ふれあい…)が、材木岩公園・白石城・白石市
 * 商家資料館・キツネ村・片倉家中武家屋敷(旧小関家)・壽丸屋敷・傑山寺
 * と、白石市のほぼすべての主要な見どころをすでに使っています。この
 * ため、白石城・武家屋敷を今回も追加すると、別の事実にしても
 * 8a15b42c 1本と白石市の内容がかなり重なる形になります。今回は
 * 重ならない弥治郎こけし村のみを追加しましたが、それでも15:24終了
 * です。白石城・武家屋敷も追加するかどうか、ご判断をお願いします。
 *
 * 蔵王エコーラインの開通期間: 令和8年(2026)4月24日に開通したことを
 * pref.miyagi.jp/soshiki/kankou/yamabiraki2026.htmlで確認(直接開いて
 * 確認)。冬季の閉鎖開始日(11月上旬ごろ)は、検索の要約以上の直接の
 * 確認ができていません。本文は具体的な日付を書かず「春から秋にかけて
 * だけ走ることのできる道」という書き方にしているため、現在の設定
 * (今日2026年10月11日時点)でも問題ありません。季節タグに「winter」が
 * 入っているのは誤りのため、春夏秋のみに修正します。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KATTAMINEJINJA_FROM = "享保3年(1721)に建てられたものと確認されており";
const KATTAMINEJINJA_TO = "享保3年(1718)に建てられたものと確認されており";

const KATTAMINEJINJA_END_FROM = "見学を終えたら、車でおよそ40分、遠刈田温泉方面へ戻りましょう。";
const KATTAMINEJINJA_END_TO = "見学を終えたら、車でおよそ55分、弥治郎こけし村へ向かいましょう。";

const YAJIRO_MEMO =
  "刈田嶺神社奥宮から車でおよそ55分、弥治郎こけし村に着きます。宮城伝統こけしには、遠刈田・鳴子・作並・肘折と並んで、弥治郎も代表的な系統の一つに数えられています。同じ宮城県内でも、遠刈田こけしとは胴や頭の形、描かれる模様が異なり、系統ごとの違いを見比べられるのが魅力です。村内では、こけし工人による制作の実演を見学できるほか、絵付け体験もできます。見学を終えたら、車でおよそ20分、白石蔵王駅方面へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;

  const echoline = await findSpotInItinerary(itinId, { spotName: "蔵王エコーライン" });
  const takimidai = await findSpotInItinerary(itinId, { spotName: "滝見台" });
  const komakusadaira = await findSpotInItinerary(itinId, { spotName: "駒草平" });
  const okama = await findSpotInItinerary(itinId, { spotName: "蔵王のお釜" });
  const kattaminejinja = await findSpotInItinerary(itinId, { spotName: "刈田嶺神社奥宮" });

  if (!kattaminejinja.memo?.includes(KATTAMINEJINJA_FROM)) throw new Error("刈田嶺神社奥宮の年号の文言が想定外です");
  if (!kattaminejinja.memo?.includes(KATTAMINEJINJA_END_FROM)) throw new Error("刈田嶺神社奥宮の結びの文言が想定外です");

  console.log("確認OK。dayId:", echoline.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$executeRawUnsafe(
    `update itinerary set seasons = '{spring,summer,autumn}' where id = $1::uuid`,
    itinId
  );

  const kattaminejinjaMemo = kattaminejinja.memo!
    .replace(KATTAMINEJINJA_FROM, KATTAMINEJINJA_TO)
    .replace(KATTAMINEJINJA_END_FROM, KATTAMINEJINJA_END_TO);

  await prisma.$transaction(async (tx) => {
    const items: SpotOrderItem[] = [
      {
        id: echoline.id,
        data: { lat: 38.136326, lng: 140.515704 },
      },
      { id: takimidai.id, data: {} },
      { id: komakusadaira.id, data: {} },
      {
        id: okama.id,
        data: { stayDurationMin: 45 },
      },
      {
        id: kattaminejinja.id,
        data: {
          memo: kattaminejinjaMemo,
          lat: 38.127763,
          lng: 140.448083,
          visitTime: t(12, 54),
          stayDurationMin: 35,
        },
      },
      {
        create: {
          name: "弥治郎こけし村",
          memo: YAJIRO_MEMO,
          lat: 38.052368,
          lng: 140.527512,
          visitTime: t(14, 24),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 55, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(echoline.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
