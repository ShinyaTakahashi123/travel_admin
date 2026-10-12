/**
 * #141 050431baの直し(5回目)。
 * ①企画運営の指摘: 森林博物館の結び「この後は、車を置いて歩き、
 *   およそ9分」は、車はもう駅近くの駐車場に置いている設定のため
 *   「この後は、歩いておよそ9分」に直す。
 * ②法務の指摘: 八甲田山麓(昼食)の座標が案内所の点(Hakkoda Guide
 *   Club)だったため、ロープウェー山麓駅w442873117の中心
 *   40.6808985,140.8316892に修正。八甲田ロープウェーの座標も案内板の
 *   点(山頂公園案内図)だったため、山頂公園駅w442873116の中心
 *   40.6758468,140.8588712に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "この後は、車を置いて歩き、およそ9分、青森ベイブリッジへ向かいましょう。";
const TO = "この後は、歩いておよそ9分、青森ベイブリッジへ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '050431ba%'`);
  const itinId = rows[0].id;
  const shinrin = await findSpotInItinerary(itinId, { spotName: "青森市森林博物館" });
  const hakkodaLunch = await findSpotInItinerary(itinId, { spotName: "八甲田山麓" });
  const hakkodaRopeway = await findSpotInItinerary(itinId, { spotName: "八甲田ロープウェー" });

  if (!shinrin.memo?.includes(FROM)) throw new Error("森林博物館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: shinrin.id }, data: { memo: shinrin.memo!.replace(FROM, TO) } }),
    prisma.spot.update({ where: { id: hakkodaLunch.id }, data: { lat: 40.6808985, lng: 140.8316892 } }),
    prisma.spot.update({ where: { id: hakkodaRopeway.id }, data: { lat: 40.6758468, lng: 140.8588712 } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
