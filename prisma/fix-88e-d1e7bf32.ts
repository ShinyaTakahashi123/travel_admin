/**
 * #88 d1e7bf32 fix-88dの直後の直し。itinerary-auditが十和田湖遊覧船のメモで
 * 「料金・時刻・日程・先の予定の記載」を検出(「13時15分発のBコース」の時刻表記)。
 * 決まりどおり、具体的な時刻を書かない表現に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "13時15分発のBコースまで少し時間があるので、桟橋周辺で昼食をとるとよいでしょう。";
const TO = "次の便まで少し時間があるので、桟橋周辺で昼食をとるとよいでしょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;

  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });
  if (!cruise.memo!.includes(FROM)) throw new Error("一致しません(遊覧船)");
  const newMemo = cruise.memo!.split(FROM).join(TO);

  console.log("十和田湖遊覧船: OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: cruise.id }, { memo: newMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
