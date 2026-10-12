/**
 * #124 c1204e30(小樽運河と青の洞窟)の直し。
 * もとは5か所・09:00〜16:15で終了(終了のみ、4か所以上は満たしていた)。
 * 美国の文中で既に「近くには黄金岬をはじめとした見晴らしのよい景勝地も
 * 点在していて」と触れられていた黄金岬を、実在の行き先として独立した
 * スポットにし、09:00〜16:47に。
 * 黄金岬は#217(小樽・積丹、制作補助2)でも取り上げているため、文は
 * 書き分けている(名前の由来・夕日の記述は出典で確認できなかったため
 * 書かず、積丹ブルーの海の眺めという一般的な事実のみ記載)。
 * 座標: 36.3031736... (訂正)43.3031736, 140.6013495(Nominatim、osm_id
 * 5603040047、積丹町美国)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MIKUNI_FROM = "次はいよいよ、積丹半島の断崖絶壁が続くエリアへ向かいます。";
const MIKUNI_TO = "次は、美国漁港のそばにある黄金岬へ向かいます。";

const OGANE_MEMO =
  "美国漁港のそばから車でおよそ10分、黄金岬に着きます。積丹半島の海岸に突き出た岬で、遊歩道が整備されています。岬の先端からは、積丹ブルーと呼ばれる透明度の高い海を望めます。この後は、車でおよそ22分、積丹半島の断崖絶壁が続くエリア、積丹岬へ向かいます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const mikuni = await findSpotInItinerary(itinId, { spotName: "積丹半島（美国町）" });
  const shakotanCape = await findSpotInItinerary(itinId, { spotName: "積丹岬" });

  if (!mikuni.memo?.includes(MIKUNI_FROM)) throw new Error("美国の文言が想定外です");

  console.log("確認OK。dayId:", mikuni.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: mikuni.id }, { memo: mikuni.memo!.replace(MIKUNI_FROM, MIKUNI_TO) });

  const spots = await prisma.spot.findMany({ where: { dayId: mikuni.dayId }, orderBy: { orderNo: "asc" } });
  await setDaySpotOrder(
    mikuni.dayId,
    spots.flatMap((s): SpotOrderItem[] => {
      if (s.id === shakotanCape.id) {
        return [
          {
            create: {
              name: "黄金岬",
              memo: OGANE_MEMO,
              lat: 43.3031736,
              lng: 140.6013495,
              visitTime: t(14, 58),
              stayDurationMin: 25,
              transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
            },
          },
          {
            id: s.id,
            data: {
              visitTime: t(15, 45),
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 22, transitLine: null }] },
            },
          },
        ];
      }
      return [{ id: s.id, data: {} }];
    })
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
