/**
 * #112 78026dc9の直し(3回目)。flow-check.cjsで見つかった文言のずれ:
 * 1. 紅葉谷公園の書き出しが「大聖院から」のままだったが、実際に
 *    前に来るのは五重塔。
 * 2. 大聖院の書き出しが「今日は歩き始めます」(1番目のスポット想定の
 *    書き方)のままだったが、実際には4番目(紅葉谷公園のあと)。
 * 3. 大元神社(Day1最後・最終日ではない)に宿の一言がなかったため追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const MOMIJIDANI_FROM = "大聖院から歩いておよそ8分、紅葉谷公園に着きます。";
const MOMIJIDANI_TO = "五重塔から歩いておよそ7分、紅葉谷公園に着きます。";

const TAISHOIN_FROM =
  "大同元年(806)、唐から帰国した弘法大師空海が、宮島の霊峰・弥山で修行したのちに開いたと伝えられる、宮島で最も歴史ある寺院とされる大聖院から、今日は歩き始めます。";
const TAISHOIN_TO =
  "紅葉谷公園から歩いておよそ8分、大同元年(806)、唐から帰国した弘法大師空海が、宮島の霊峰・弥山で修行したのちに開いたと伝えられる、宮島で最も歴史ある寺院とされる大聖院に着きます。";

const OMOTO_FROM = "水族館のにぎわいから一転、静かな社殿の前で、今日めぐってきた宮島の一日を振り返ってみましょう。参拝の際は、敬意を込めて手を合わせましょう。";
const OMOTO_TO =
  "水族館のにぎわいから一転、静かな社殿の前で、今日めぐってきた宮島の一日を振り返ってみましょう。参拝の際は、敬意を込めて手を合わせましょう。今夜は、宮島か対岸の宮島口の宿に泊まり、旅の疲れを癒やしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const momijidani = await findSpotInItinerary(itinId, { spotName: "紅葉谷公園" });
  const taishoin = await findSpotInItinerary(itinId, { spotName: "大聖院" });
  const omoto = await findSpotInItinerary(itinId, { spotName: "大元神社" });

  if (!momijidani.memo!.includes(MOMIJIDANI_FROM)) throw new Error("紅葉谷公園の文言が想定外です");
  if (!taishoin.memo!.includes(TAISHOIN_FROM)) throw new Error("大聖院の文言が想定外です");
  if (!omoto.memo!.includes(OMOTO_FROM)) throw new Error("大元神社の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: momijidani.id }, { memo: momijidani.memo!.replace(MOMIJIDANI_FROM, MOMIJIDANI_TO) });
  await updateSpotInItinerary(itinId, { spotId: taishoin.id }, { memo: taishoin.memo!.replace(TAISHOIN_FROM, TAISHOIN_TO) });
  await updateSpotInItinerary(itinId, { spotId: omoto.id }, { memo: omoto.memo!.replace(OMOTO_FROM, OMOTO_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
