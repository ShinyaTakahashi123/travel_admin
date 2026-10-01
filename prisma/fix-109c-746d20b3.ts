/**
 * #109 746d20b3(郡上八幡)の直し(3回目)。企画運営(2026-10-01 12:36)の
 * 指摘3点。
 * 1. いがわ小径45分は、いわさきの開店(10:00)待ちのための水増しと判明
 *    (決まりA)。実際の長さ(18分、数百mの小径)に戻し、朝9時から入れる
 *    実在の行き先として日吉神社(新規)を前に追加した。郡上八幡の町なかに
 *    ある三大神社のひとつで、#36 1cfd3212では使われていない場所。
 *    座標はOSM・Nominatimでは見つからず、GSI住所検索で「郡上市八幡町
 *    島谷683番地」を解決した値(35.747601,136.95932)を使用(#105の人穴と
 *    同じ精度の考え方)。
 * 2. 車の流れ: やなか水のこみちに車で来たあと、宗祇水〜郡上八幡城まで
 *    歩きどおしで、車に戻る一言がなかった。やなか水のこみちの書き出しに
 *    駐車の一文を追加し、郡上八幡城の結びに「やなか水のこみちまで歩いて
 *    戻り、車に乗って」の一文を追加した。
 * 3. 郡上八幡城の冬季(11〜2月)の閉館時刻をhttps://hachiman-castle.com/guide/
 *    で確認したところ16:30(最終入城は15分前)だった。現在の日程は
 *    15:30着・16:30発のため、冬でも間に合うことを確認(季節の除外は不要)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HIYOSHI_MEMO =
  "郡上八幡ICから車でおよそ5分、旅の始まりは日吉神社です。郡上八幡の町なかに鎮座する三つの神社(日吉神社・八幡神社・岸剱神社)のひとつで、毎年4月第3土曜・日曜に行われる春祭りでは、三社そろって大神楽を奉納する「大神楽競演」が見どころとなっています。この大神楽は、岐阜県の重要無形民俗文化財に指定されています。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ4分、いがわ小径へ向かいましょう。";

const IGAWA_FROM = "郡上八幡ICから車でおよそ5分、旅の始まりはいがわ小径です。";
const IGAWA_TO = "日吉神社から歩いておよそ4分、いがわ小径に着きます。";

const YANAKA_FROM = "サンプルビレッジいわさきから車でおよそ10分、やなか水のこみちに着きます。";
const YANAKA_TO = "サンプルビレッジいわさきから車でおよそ10分、やなか水のこみちに着きます。近くの駐車場に車を停め、ここから先は歩いてまわります。";

const JO_FROM = "郡上八幡の水とものづくり、歴史をめぐる旅はこれで終わりです。帰りは、郡上八幡ICから東海北陸自動車道で戻りましょう。";
const JO_TO = "郡上八幡の水とものづくり、歴史をめぐる旅はこれで終わりです。やなか水のこみちまで歩いておよそ10分戻って車に乗り、郡上八幡ICから東海北陸自動車道で戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '746d20b3%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const igawa = await findSpotInItinerary(itinId, { spotName: "いがわ小径" });
  const iwasaki = await findSpotInItinerary(itinId, { spotName: "サンプルビレッジいわさき" });
  const yanaka = await findSpotInItinerary(itinId, { spotName: "やなか水のこみち" });
  const sogisui = await findSpotInItinerary(itinId, { spotName: "宗祇水" });
  const kyuchosha = await findSpotInItinerary(itinId, { spotName: "郡上八幡旧庁舎記念館" });
  const hakurankan = await findSpotInItinerary(itinId, { spotName: "郡上八幡博覧館" });
  const shokunin = await findSpotInItinerary(itinId, { spotName: "職人町・鍛冶屋町" });
  const jo = await findSpotInItinerary(itinId, { spotName: "郡上八幡城" });

  if (!igawa.memo!.includes(IGAWA_FROM)) throw new Error("いがわ小径の文言が想定外です");
  if (!yanaka.memo!.includes(YANAKA_FROM)) throw new Error("やなか水のこみちの文言が想定外です");
  if (!jo.memo!.includes(JO_FROM)) throw new Error("郡上八幡城の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "日吉神社",
        address: "岐阜県郡上市八幡町島谷683",
        lat: 35.747601,
        lng: 136.95932,
        memo: HIYOSHI_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 23,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    { id: igawa.id, data: { memo: igawa.memo!.replace(IGAWA_FROM, IGAWA_TO), visitTime: t(9, 27), stayDurationMin: 18, transitMode: "walk", transitDurationMin: 4 } },
    { id: iwasaki.id, data: { visitTime: t(10, 0), transitMode: "car", transitDurationMin: 15 } },
    { id: yanaka.id, data: { memo: yanaka.memo!.replace(YANAKA_FROM, YANAKA_TO) } },
    { id: sogisui.id, data: {} },
    { id: kyuchosha.id, data: {} },
    { id: hakurankan.id, data: {} },
    { id: shokunin.id, data: {} },
    { id: jo.id, data: { memo: jo.memo!.replace(JO_FROM, JO_TO) } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
