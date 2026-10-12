/**
 * #144 0d8b6309の直し(4回目)。企画運営の指摘1点・法務の指摘2点。
 * ①栄山寺の95分は八角堂と行宮跡を見る中身としては長すぎたため50分に
 *   短縮し、空いた45分で「重要伝統的建造物群保存地区 五條新町」
 *   (旧紀州街道沿いの江戸時代の商家町、平成22年/2010選定)を新設。
 *   既存2本(ecdd6ad8・0d3ae277)には使われていない場所であることを
 *   確認済み。
 * ②吉野山参道(昼食)の座標が金峯山寺の点そのものだったため、参道を
 *   通る県道w136380799「桜井明日香吉野線」のNominatim中心
 *   34.3690730,135.8589084に修正。
 * ③賀名生の里歴史民俗資料館に「このあたりの食事処で昼食をとりましょう」
 *   が残っていて昼食が2回になっていたため削除(昼食は吉野山参道の
 *   1回のみに)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const EISANJI_FROM = "見学を終えたら、車でおよそ5分、JR五条駅へ向かい、レンタカーを返しましょう。";
const EISANJI_TO = "この後は、車でおよそ8分、五條新町へ向かいましょう。";

const SHINMACHI_MEMO =
  "栄山寺から車でおよそ8分、重要伝統的建造物群保存地区の五條新町に着きます。旧紀州街道沿いに、江戸時代の重厚な商家の町家が軒を連ねる、歴史ある町並みです。平成22年(2010)に重要伝統的建造物群保存地区に選ばれました。格子窓や虫籠窓など、当時の商家の意匠を眺めながら、通りをのんびりと歩いてみましょう。見学を終えたら、車でおよそ3分、JR五条駅へ向かい、レンタカーを返しましょう。";

const KANAU_FROM = "あわせてうかがうことができます。休館日は公式サイトで確かめましょう。このあたりの食事処で昼食をとりましょう。この後は、車でおよそ15分、栄山寺へ向かいましょう。";
const KANAU_TO = "あわせてうかがうことができます。休館日は公式サイトで確かめましょう。この後は、車でおよそ15分、栄山寺へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0d8b6309%'`);
  const itinId = rows[0].id;
  const nyoirinji = await findSpotInItinerary(itinId, { spotName: "如意輪寺" });
  const yoshimizu = await findSpotInItinerary(itinId, { spotName: "吉水神社" });
  const kinpusen = await findSpotInItinerary(itinId, { spotName: "金峯山寺" });
  const sando = await findSpotInItinerary(itinId, { spotName: "吉野山参道" });
  const kanau = await findSpotInItinerary(itinId, { spotName: "賀名生の里歴史民俗資料館" });
  const eisanji = await findSpotInItinerary(itinId, { spotName: "栄山寺" });
  const dayId = eisanji.dayId;

  if (!eisanji.memo?.includes(EISANJI_FROM)) throw new Error("栄山寺の文言が想定外です");
  if (!kanau.memo?.includes(KANAU_FROM)) throw new Error("賀名生の里歴史民俗資料館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { id: nyoirinji.id, data: {} },
      { id: yoshimizu.id, data: {} },
      { id: kinpusen.id, data: {} },
      { id: sando.id, data: { lat: 34.3690730, lng: 135.8589084 } },
      { id: kanau.id, data: { memo: kanau.memo!.replace(KANAU_FROM, KANAU_TO) } },
      {
        id: eisanji.id,
        data: {
          stayDurationMin: 50,
          memo: eisanji.memo!.replace(EISANJI_FROM, EISANJI_TO),
        },
      },
      {
        create: {
          name: "五條新町", lat: 34.3484213, lng: 135.6923610,
          visitTime: t(15, 53), stayDurationMin: 45, memo: SHINMACHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
