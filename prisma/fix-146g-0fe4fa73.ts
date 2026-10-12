/**
 * #146 0fe4fa73の直し(7回目、自己点検)。六甲ガーデンテラス→ROKKO森の音
 * ミュージアムが0.8kmなのにbus/10分だったため「近いのにbus」と検出
 * された。歩いても行ける距離のため、walk/12分に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "六甲ガーデンテラスからバスでおよそ10分、ROKKO森の音ミュージアムに着きます。";
const TO = "六甲ガーデンテラスから歩いておよそ12分、ROKKO森の音ミュージアムに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const morinooto = await findSpotInItinerary(itinId, { spotName: "ROKKO森の音ミュージアム" });

  if (!morinooto.memo?.includes(FROM)) throw new Error("ROKKO森の音ミュージアムの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: morinooto.id },
    data: {
      memo: morinooto.memo!.replace(FROM, TO),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
    },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
