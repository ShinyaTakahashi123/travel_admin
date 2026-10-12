/**
 * #92 1fdbcd75（時計台から大通公園へ。札幌の街を気軽に楽しむプラン）通常の
 * 見直し。既存は5か所09:00〜15:40で、終了が規定外(16:30〜17:00に届かない)。
 *
 * 【タイトルと中身の食い違いを発見】タイトルは「時計台から大通公園へ」だが、
 * 既存の5か所には時計台も大通公園も含まれていなかった。両方とも実在の
 * 定番スポットで、サッポロビール博物館→狸小路商店街の間に地理的にも
 * 無理なく組み込めるため、新規に追加してタイトルの内容と一致させた。
 *
 * 開いたURL:
 * - 時計台(クラーク博士の提案・1878年建設・塔時計・機械遺産): https://sapporoshi-tokeidai.jp/know/walking.php
 * - 大通公園(火防線としての由来・花壇・雪まつり): https://odori-park.jp/history/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "場外市場の海鮮朝食から、北海道大学の並木道、サッポロビール博物館、札幌市時計台、大通公園、狸小路商店街、円山公園まで。札幌の定番スポットを1日で回るプランです。";

const BEER_FROM = "北海道開拓とビールづくりの歴史に触れたら、活気あふれる狸小路商店街へ向かいましょう。";
const BEER_TO = "北海道開拓とビールづくりの歴史に触れたら、札幌市時計台へ向かいましょう。";

const TOKEIDAI_MEMO =
  "サッポロビール博物館から地下鉄でおよそ15分、札幌市時計台に着きます。前身は、札幌農学校の初代教頭クラーク博士の提案で1878年(明治11年)に建てられた演武場です。ホイーラー教頭がアメリカから取り寄せた塔時計は、1881年から澄んだ音色で時を刻み続けており、2009年には日本機械学会の「機械遺産」に認定されました。国の重要文化財にも指定されている、札幌を代表する建物です。この後は、歩いておよそ10分、大通公園へ向かいましょう。";

const ODORI_MEMO =
  "時計台から歩いておよそ10分、大通公園に着きます。1871年(明治4年)、札幌の中心部を北の官庁街と南の住宅・商業街とに分ける火防線として設けられたのが始まりです。明治8年ごろから花壇が設けられ、今も花壇コンクールが催されています。冬には「さっぽろ雪まつり」の会場としても知られ、大通公園だけで200基を超える雪像を目当てに、国内外から多くの人が訪れます。東側には、札幌のシンボルであるさっぽろテレビ塔もそびえています。四季折々の花や木々を眺めながら、公園を歩いてみましょう。この後は、歩いておよそ13分、狸小路商店街へ向かいましょう。";

const TANUKI_FROM = "次に訪れるのは、札幌らしい賑わいを見せるアーケード街、狸小路商店街です。";
const TANUKI_TO = "大通公園から歩いておよそ13分、札幌らしい賑わいを見せるアーケード街、狸小路商店街に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1fdbcd75%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const ichiba = await findSpotInItinerary(itinId, { spotName: "札幌市中央卸売市場場外市場" });
  const hokudai = await findSpotInItinerary(itinId, { spotName: "北海道大学" });
  const beer = await findSpotInItinerary(itinId, { spotName: "サッポロビール博物館" });
  const tanuki = await findSpotInItinerary(itinId, { spotName: "狸小路商店街" });
  const maruyama = await findSpotInItinerary(itinId, { spotName: "円山公園（札幌）" });

  const check = (memo: string | null, from: string, label: string) => {
    if (!memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(beer.memo, BEER_FROM, "ビール博物館");
  check(tanuki.memo, TANUKI_FROM, "狸小路冒頭");

  const day1Spots: SpotOrderItem[] = [
    { id: ichiba.id, data: {} },
    { id: hokudai.id, data: {} },
    { id: beer.id, data: { memo: beer.memo!.replace(BEER_FROM, BEER_TO) } },
    {
      create: {
        name: "札幌市時計台",
        address: "北海道札幌市中央区北1条西2丁目",
        lat: 43.0625537,
        lng: 141.3536448,
        memo: TOKEIDAI_MEMO,
        visitTime: t(13, 13),
        stayDurationMin: 20,
        transitMode: "train",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      create: {
        name: "大通公園",
        address: "北海道札幌市中央区大通西",
        lat: 43.0599018,
        lng: 141.3475101,
        memo: ODORI_MEMO,
        visitTime: t(13, 43),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      id: tanuki.id,
      data: {
        memo: tanuki.memo!.replace(TANUKI_FROM, TANUKI_TO),
        visitTime: t(14, 26),
        transitMode: "walk",
        transitDurationMin: 13,
        transitLine: null,
      },
    },
    { id: maruyama.id, data: { visitTime: t(15, 34) } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    const knownStay: Record<string, number> = { [ichiba.id]: 45, [hokudai.id]: 96, [beer.id]: 62, [tanuki.id]: 53, [maruyama.id]: 79 };
    for (const x of day1Spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
