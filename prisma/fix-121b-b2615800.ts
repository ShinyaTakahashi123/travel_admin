/**
 * #121 b2615800の直し(2回目)。千葉ポートパーク→千葉県立美術館が0.3kmしか
 * ないのにcar10分だった(itinerary-audit.cjsの⚠)。徒歩5分に修正し、5分短縮
 * した分を下流の千葉神社・千葉公園・加曽利貝塚博物館のvisitTimeにも反映。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FROM = "千葉ポートパークから車でおよそ10分、千葉県立美術館に着きます。";
const TO = "千葉ポートパークから歩いておよそ5分、千葉県立美術館に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b2615800%'`);
  const itinId = rows[0].id;
  const museum = await findSpotInItinerary(itinId, { spotName: "千葉県立美術館" });
  const jinja = await findSpotInItinerary(itinId, { spotName: "千葉神社" });
  const koen = await findSpotInItinerary(itinId, { spotName: "千葉公園" });
  const kasori = await findSpotInItinerary(itinId, { spotName: "加曽利貝塚博物館" });
  if (!museum.memo?.includes(FROM)) throw new Error("文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: museum.id }, {
    memo: museum.memo!.replace(FROM, TO),
    visitTime: t(11, 0),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
  });
  await updateSpotInItinerary(itinId, { spotId: jinja.id }, { visitTime: t(12, 15) });
  await updateSpotInItinerary(itinId, { spotId: koen.id }, { visitTime: t(13, 15) });
  await updateSpotInItinerary(itinId, { spotId: kasori.id }, { visitTime: t(14, 50) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
