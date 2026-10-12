/**
 * #97 3993afce の直し(8回目)。itinerary-audit.cjsで、ヤンマーミュージアムから
 * 長浜びわこ大仏への移動(車で10分、0.8km)が「近いのに車」と指摘された。
 * 徒歩に直す(0.8kmなら徒歩12分が妥当)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const FROM = "ヤンマーミュージアムから車でおよそ10分、長浜びわこ大仏に着きます。";
const TO = "ヤンマーミュージアムから歩いておよそ12分、長浜びわこ大仏に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;
  const daibutsu = await findSpotInItinerary(itinId, { spotName: "長浜びわこ大仏" });
  if (!daibutsu.memo!.includes(FROM)) throw new Error("一致しません");
  if (daibutsu.transitMode !== "car" || daibutsu.transitDurationMin !== 10) throw new Error("想定外の値です");
  console.log("OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: daibutsu.id }, {
    memo: daibutsu.memo!.replace(FROM, TO),
    transitMode: "walk",
    transitDurationMin: 12,
    visitTime: t(16, 8),
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
