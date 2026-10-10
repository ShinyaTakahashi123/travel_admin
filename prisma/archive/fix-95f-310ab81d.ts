/**
 * #95 310ab81d 企画運営(2026-10-01 01:08)の指摘。普門寺の10分延長は
 * そのままでよいが、日出の石門を35→55分にしたのは「椰子の実」記念碑を
 * 見る時間としては長すぎた(碑は5〜10分程度)。記念碑を独立したスポットに
 * し、日出の石門は35分(元)に戻す。空いた時間は、伊良湖岬灯台に実在の
 * 内容(恋人の聖地・遊歩道)を加えて埋める。
 *
 * 椰子の実記念碑の座標: Overpass(overpass-api.de・overpass.kumi.systems
 * とも接続不可)・Nominatim(「椰子の実」「椰子の実記念碑」「椰子の実の
 * 歌碑」等、bbox指定含む複数の検索語)のいずれでも記念碑自体のOSM点は
 * 見つからなかった。日出の石門(OSM way 131024414、34.577464,137.038671)
 * を基点に、記念碑がある入口(日出園地)側の方向へおよそ150m移動した位置
 * (34.578664,137.037871)を推定値として使う。
 *
 * 開いたURL:
 * - 椰子の実記念碑(由来): 田原市公式
 *   https://www.city.tahara.aichi.jp/shisetsu/kankou/1002465.html
 * - 伊良湖岬灯台(恋人の聖地・遊歩道): るるぶ&more.
 *   https://rurubu.jp/andmore/spot/80024296
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HIIDENOSEKIMON_MEMO =
  "恋路ヶ浜から車でおよそ4分、日出の石門に着きます。太平洋の荒波の浸食によってできた、中央に洞穴のあいた岩で、沖の石門と岸の石門の2つがあります。日の出の時間帯に見られる美しいシルエットでも知られ、荒々しい岩と青い海が織りなす景色を楽しめます。岩場は滑りやすいので、足元に気をつけましょう。この後は、歩いておよそ3分、椰子の実記念碑へ向かいましょう。";

const YASHINOMI_MEMO =
  "日出の石門から歩いておよそ3分、椰子の実記念碑に着きます。民俗学者・柳田國男が明治31年(1898)、伊良湖に滞在した際に拾った椰子の実の話を、親友の島崎藤村に語ったことがきっかけとなり、藤村の詩「椰子の実」が生まれました。その詩に大中寅二が曲をつけ、昭和11年(1936)には国民歌謡として全国に放送されました。日出園地の一角に、詩と歌、それぞれの記念碑が並んで立っています。この後は、車でおよそ5分、伊良湖岬灯台へ向かいましょう。";

const IRAGOLIGHTHOUSE_MEMO =
  "椰子の実記念碑から車でおよそ5分、伊良湖岬灯台に着きます。渥美半島の最先端に立つ白亜の灯台で、黒潮がおどる太平洋と、波静かな三河湾の両方を望むことができます。平成10年(1998)には「日本の灯台50選」にも選ばれました。恋路ヶ浜とあわせて「恋人の聖地」にも選ばれており、灯台からは遊歩道も整備されています。夕暮れどきには、白い灯台と青い海のコントラストが、ひときわ美しく見えます。今夜はこの近くの宿に泊まります。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const omotehama = await findSpotInItinerary(itinId, { spotName: "表浜海岸" });
  const santepark = await findSpotInItinerary(itinId, { spotName: "サンテパルクたはら" });
  const longbeach = await findSpotInItinerary(itinId, { spotName: "太平洋ロングビーチ" });
  const akabane = await findSpotInItinerary(itinId, { spotName: "道の駅あかばねロコステーション" });
  const koiji = await findSpotInItinerary(itinId, { spotName: "恋路ヶ浜" });
  const hiide = await findSpotInItinerary(itinId, { spotName: "日出の石門" });
  const irago = await findSpotInItinerary(itinId, { spotName: "伊良湖岬灯台" });
  const yashinomiExisting = await (async () => {
    try {
      return await findSpotInItinerary(itinId, { spotName: "椰子の実記念碑" });
    } catch {
      return null;
    }
  })();

  const day1Spots: SpotOrderItem[] = [
    { id: omotehama.id, data: {} },
    { id: santepark.id, data: {} },
    { id: longbeach.id, data: {} },
    { id: akabane.id, data: {} },
    { id: koiji.id, data: {} },
    { id: hiide.id, data: { memo: HIIDENOSEKIMON_MEMO, stayDurationMin: 35, visitTime: t(14, 43) } },
    yashinomiExisting
      ? {
          id: yashinomiExisting.id,
          data: {
            memo: YASHINOMI_MEMO,
            visitTime: t(15, 21),
            stayDurationMin: 12,
            transitMode: "walk",
            transitDurationMin: 3,
            transitLine: null,
          },
        }
      : {
          create: {
            name: "椰子の実記念碑",
            address: "愛知県田原市日出町",
            lat: 34.578664,
            lng: 137.037871,
            memo: YASHINOMI_MEMO,
            visitTime: t(15, 21),
            stayDurationMin: 12,
            transitMode: "walk",
            transitDurationMin: 3,
            transitLine: null,
          },
        },
    {
      id: irago.id,
      data: { memo: IRAGOLIGHTHOUSE_MEMO, visitTime: t(15, 38), stayDurationMin: 58, transitMode: "car", transitDurationMin: 5, transitLine: null },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1(組み替え後) ---");
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
