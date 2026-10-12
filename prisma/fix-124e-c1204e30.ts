/**
 * #124 c1204e30の直し(5回目)。fix-124dで作ったスクリプトの不備を直す。
 * 1. 金融資料館「入館は無料です」が料金記載チェックに引っかかった→削除
 * 2. 小樽運河のstayDurationMinを90分にするつもりが25分のままだった
 *    (時刻の計算が合わない原因)→90分に修正し、下流のvisitTimeも直す
 * 3. 美国の座標を実際のOSM点(美国港)に直した結果、黄金岬との距離が
 *    0.3kmになり、car10分は遅すぎた→car3分に修正
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KINYU_FROM = "辰野金吾らが手がけた建物で、入館は無料です。日本銀行の歴史を紹介する展示室のほか、";
const KINYU_TO = "辰野金吾らが手がけた建物です。日本銀行の歴史を紹介する展示室のほか、";

const TEMIYASEN_FROM = "この後は、車でおよそ60分、積丹半島へ向かいます。";
const TEMIYASEN_TO = "この後は、車でおよそ75分、積丹半島へ向かいます。";

const MIKUNI_FROM = "次は、車でおよそ10分の黄金岬へ向かいます。";
const MIKUNI_TO = "次は、車でおよそ3分の黄金岬へ向かいます。";

const OGANE_FROM = "美国漁港のそばから車でおよそ10分、黄金岬に着きます。";
const OGANE_TO = "美国漁港のそばから車でおよそ3分、黄金岬に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const kinyu = await findSpotInItinerary(itinId, { spotName: "日本銀行旧小樽支店金融資料館" });
  const unga = await findSpotInItinerary(itinId, { spotName: "小樽運河" });
  const temiyasen = await findSpotInItinerary(itinId, { spotName: "旧手宮線" });
  const mikuni = await findSpotInItinerary(itinId, { spotName: "積丹半島（美国町）" });
  const ogane = await findSpotInItinerary(itinId, { spotName: "黄金岬" });

  if (!kinyu.memo?.includes(KINYU_FROM)) throw new Error("金融資料館の文言が想定外です");
  if (!temiyasen.memo?.includes(TEMIYASEN_FROM)) throw new Error("旧手宮線の文言が想定外です");
  if (!mikuni.memo?.includes(MIKUNI_FROM)) throw new Error("美国の文言が想定外です");
  if (!ogane.memo?.includes(OGANE_FROM)) throw new Error("黄金岬の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kinyu.id }, { memo: kinyu.memo!.replace(KINYU_FROM, KINYU_TO) });
  await updateSpotInItinerary(itinId, { spotId: unga.id }, { stayDurationMin: 90 });
  await updateSpotInItinerary(
    itinId,
    { spotId: temiyasen.id },
    { visitTime: t(11, 25), memo: temiyasen.memo!.replace(TEMIYASEN_FROM, TEMIYASEN_TO) }
  );
  await updateSpotInItinerary(
    itinId,
    { spotId: mikuni.id },
    { memo: mikuni.memo!.replace(MIKUNI_FROM, MIKUNI_TO) }
  );
  await updateSpotInItinerary(itinId, { spotId: ogane.id }, {
    memo: ogane.memo!.replace(OGANE_FROM, OGANE_TO),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3, transitLine: null }] },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
