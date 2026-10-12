/**
 * #106 6ba2fc04の直し(7回目)。fix-106hで天橋立→智恩寺の移動を10→18分に
 * 直した際、智恩寺自身のvisitTimeを連動させ忘れたための「時刻の計算が
 * 合わない」を解消する。智恩寺のvisitTimeを13:42→13:50に直す
 * (天橋立の終わり13:32+18分)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const chionji = await findSpotInItinerary(itinId, { spotName: "智恩寺" });

  console.log("現在のvisitTime:", chionji.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: chionji.id }, { visitTime: t(13, 50) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
