/**
 * #137 ec2b0e8dの直し(2回目、137bを置き換え)。企画運営・法務の指摘を
 * まとめて反映。
 * ・文翔館の座標が、もとから別の施設「山形市郷土館」(旧済生館本館、
 *   文翔館から約1.1km)と同じ値だった(もとの未確認データの誤り)。
 *   実際の文翔館の点(n2418522207)に修正し、移動時間・本文を直す。
 * ・霞城公園(w728946713の中心)・御殿堰(n6077829986)・山形美術館
 *   (w262671458の中心)の座標も、法務指定の点に修正。
 * ・御殿堰の「鳥居忠正」は「鳥居忠政」の誤りだったため訂正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MUSEUM_FROM = "この後は、歩いておよそ3分、文翔館へ向かいましょう。";
const MUSEUM_TO = "この後は、歩いておよそ16分、文翔館へ向かいましょう。";

const BUNSHO_FROM_OLD = "山形県立博物館から歩いておよそ3分、文翔館に着きます。";
const BUNSHO_TO_OLD = "山形県立博物館から歩いておよそ16分、文翔館に着きます。";
const BUNSHO_FROM2 = "この後は、歩いておよそ15分、御殿堰へ向かいましょう。";
const BUNSHO_TO2 = "この後は、歩いておよそ6分、御殿堰へ向かいましょう。";

const GOTEN_FROM_OPENER = "文翔館から歩いておよそ15分、御殿堰に着きます。";
const GOTEN_TO_OPENER = "文翔館から歩いておよそ6分、御殿堰に着きます。";
const GOTEN_FROM_NAME = "山形城主・鳥居忠正によって造られた";
const GOTEN_TO_NAME = "山形城主・鳥居忠政によって造られた";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'ec2b0e8d%'`);
  const itinId = rows[0].id;
  const kajo = await findSpotInItinerary(itinId, { spotName: "霞城公園" });
  const museum = await findSpotInItinerary(itinId, { spotName: "山形県立博物館" });
  const bunsho = await findSpotInItinerary(itinId, { spotName: "山形県郷土館（文翔館）" });
  const goten = await findSpotInItinerary(itinId, { spotName: "御殿堰" });
  const manabi = await findSpotInItinerary(itinId, { spotName: "山形まなび館" });
  const artmuseum = await findSpotInItinerary(itinId, { spotName: "山形美術館" });

  if (!museum.memo?.includes(MUSEUM_FROM)) throw new Error("山形県立博物館の文言が想定外です");
  if (!bunsho.memo?.includes(BUNSHO_FROM_OLD) || !bunsho.memo?.includes(BUNSHO_FROM2)) throw new Error("文翔館の文言が想定外です");
  if (!goten.memo?.includes(GOTEN_FROM_OPENER) || !goten.memo?.includes(GOTEN_FROM_NAME)) throw new Error("御殿堰の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: kajo.id }, data: { lat: 38.255577, lng: 140.328241 } }),
    prisma.spot.update({ where: { id: museum.id }, data: { memo: museum.memo!.replace(MUSEUM_FROM, MUSEUM_TO) } }),
    prisma.spot.update({
      where: { id: bunsho.id },
      data: {
        lat: 38.25668, lng: 140.341224, visitTime: t(12, 19),
        memo: bunsho.memo!.replace(BUNSHO_FROM_OLD, BUNSHO_TO_OLD).replace(BUNSHO_FROM2, BUNSHO_TO2),
      },
    }),
    prisma.spotTransitLeg.updateMany({ where: { spotId: bunsho.id }, data: { transitDurationMin: 16 } }),
    prisma.spot.update({
      where: { id: goten.id },
      data: {
        lat: 38.253257, lng: 140.339477, visitTime: t(13, 25),
        memo: goten.memo!.replace(GOTEN_FROM_OPENER, GOTEN_TO_OPENER).replace(GOTEN_FROM_NAME, GOTEN_TO_NAME),
      },
    }),
    prisma.spotTransitLeg.updateMany({ where: { spotId: goten.id }, data: { transitDurationMin: 6 } }),
    prisma.spot.update({ where: { id: manabi.id }, data: { visitTime: t(14, 31) } }),
    prisma.spot.update({ where: { id: artmuseum.id }, data: { lat: 38.255869, lng: 140.3324, visitTime: t(15, 16) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
