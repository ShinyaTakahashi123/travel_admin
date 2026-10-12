/**
 * #92 1fdbcd75 企画運営(23:10)・法務(23:06)の指摘を反映。
 * 1) 北大→ビール博物館・ビール博物館→時計台の移動時間が、どちらも
 *    「地下鉄で約15分」だったが、公式アクセス情報で確かめると不正確だった。
 *    北大→ビール博物館は、地下鉄南北線でさっぽろ駅へ、JR函館本線に乗り換えて
 *    苗穂駅、北口から徒歩8分という実在の経路に修正(公式で確認)。
 *    開いたURL: https://www.sapporobeer.jp/brewery/s_museum/access/
 *    ビール博物館→時計台は、循環88(サッポロビール園・ファクトリー線)という
 *    実在のバス路線が両地点を直接結んでいることを確かめたため、バスに
 *    修正(決まり8)。
 * 2) ビール博物館「お酒は20歳になってから。」を追加。「北海道遺産にも
 *    指定」→「選ばれています」(北海道遺産は選定であって指定ではない)。
 * 3) 場外市場のせりの時刻(5時台・6時台)を削除。
 * 4) 円山動物園の開園年による言い切りをヘッジ。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ICHIBA_FROM =
  "水産物部のせりは早朝5時台から、青果部のせりは6時台から行われ、時間帯によっては一般の見学もできるとあって、市場の活気を肌で感じられます。";
const ICHIBA_TO = "早朝にはせりが行われ、見学できる日もあるので、公式の案内で確かめましょう。";

const HOKUDAI_TAIL_FROM = "この後は、地下鉄でおよそ15分、サッポロビール博物館へ向かいましょう。";
const HOKUDAI_TAIL_TO =
  "この後は、地下鉄南北線でさっぽろ駅へ出て、JR函館本線に乗り換え、苗穂駅で降りましょう。サッポロビール博物館までは、北口から歩いておよそ8分です。";

const BEER_OPENER_FROM = "北海道大学から地下鉄でおよそ15分、サッポロビール博物館に着きます。";
const BEER_OPENER_TO = "北海道大学から地下鉄とJRを乗り継いでおよそ25分、苗穂駅の北口から歩いておよそ8分、サッポロビール博物館に着きます。";

const BEER_ISAN_FROM = "こうした歴史的価値から「北海道遺産」にも指定されています。";
const BEER_ISAN_TO = "こうした歴史的価値から「北海道遺産」にも選ばれています。";

const BEER_SAKE_FROM = "館内の売店やレストランで昼食にするのもよいでしょう。";
const BEER_SAKE_TO = "館内の売店やレストランで昼食にするのもよいでしょう。お酒は20歳になってから。";

const BEER_TAIL_FROM = "北海道開拓とビールづくりの歴史に触れたら、札幌市時計台へ向かいましょう。";
const BEER_TAIL_TO = "北海道開拓とビールづくりの歴史に触れたら、札幌市時計台へ向かいましょう。";

const TOKEIDAI_OPENER_FROM = "サッポロビール博物館から地下鉄でおよそ15分、札幌市時計台に着きます。";
const TOKEIDAI_OPENER_TO =
  "サッポロビール博物館から歩いておよそ10分、地下鉄東豊線「東区役所前駅」へ。大通駅で降り、歩いておよそ5分、札幌市時計台に着きます。";

const MARUYAMA_FROM = "すぐ隣には北海道で初めての動物園として1951年(昭和26年)に開園した円山動物園があり、";
const MARUYAMA_TO = "すぐ隣には、北海道で初めての動物園とされる円山動物園があり、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1fdbcd75%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const ichiba = await findSpotInItinerary(itinId, { spotName: "札幌市中央卸売市場場外市場" });
  const hokudai = await findSpotInItinerary(itinId, { spotName: "北海道大学" });
  const beer = await findSpotInItinerary(itinId, { spotName: "サッポロビール博物館" });
  const tokeidai = await findSpotInItinerary(itinId, { spotName: "札幌市時計台" });
  const odori = await findSpotInItinerary(itinId, { spotName: "大通公園" });
  const tanuki = await findSpotInItinerary(itinId, { spotName: "狸小路商店街" });
  const maruyama = await findSpotInItinerary(itinId, { spotName: "円山公園（札幌）" });

  const check = (memo: string | null, from: string, label: string) => {
    if (!memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(ichiba.memo, ICHIBA_FROM, "場外市場");
  check(hokudai.memo, HOKUDAI_TAIL_FROM, "北大結び");
  check(beer.memo, BEER_OPENER_FROM, "ビール博物館冒頭");
  check(beer.memo, BEER_ISAN_FROM, "ビール博物館北海道遺産");
  check(beer.memo, BEER_SAKE_FROM, "ビール博物館昼食");
  check(beer.memo, BEER_TAIL_FROM, "ビール博物館結び");
  check(tokeidai.memo, TOKEIDAI_OPENER_FROM, "時計台冒頭");
  check(maruyama.memo, MARUYAMA_FROM, "円山公園動物園");

  const beerNewMemo = beer
    .memo!.replace(BEER_OPENER_FROM, BEER_OPENER_TO)
    .replace(BEER_ISAN_FROM, BEER_ISAN_TO)
    .replace(BEER_SAKE_FROM, BEER_SAKE_TO)
    .replace(BEER_TAIL_FROM, BEER_TAIL_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: ichiba.id, data: { memo: ichiba.memo!.replace(ICHIBA_FROM, ICHIBA_TO) } },
    {
      id: hokudai.id,
      data: { memo: hokudai.memo!.replace(HOKUDAI_TAIL_FROM, HOKUDAI_TAIL_TO), stayDurationMin: 80 },
    },
    {
      id: beer.id,
      data: { memo: beerNewMemo, visitTime: t(11, 50), transitMode: "train", transitDurationMin: 25, transitLine: null },
    },
    {
      id: tokeidai.id,
      data: {
        memo: tokeidai.memo!.replace(TOKEIDAI_OPENER_FROM, TOKEIDAI_OPENER_TO),
        visitTime: t(13, 13),
        transitMode: "train",
        transitDurationMin: 21,
        transitLine: null,
      },
    },
    { id: odori.id, data: { visitTime: t(13, 43) } },
    { id: tanuki.id, data: { visitTime: t(14, 26) } },
    {
      id: maruyama.id,
      data: { memo: maruyama.memo!.replace(MARUYAMA_FROM, MARUYAMA_TO), visitTime: t(15, 34) },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    const knownStay: Record<string, number> = {
      [ichiba.id]: 45, [hokudai.id]: 96, [beer.id]: 62, [tokeidai.id]: 20, [odori.id]: 30, [tanuki.id]: 53, [maruyama.id]: 79,
    };
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
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
