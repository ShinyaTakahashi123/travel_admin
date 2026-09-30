/**
 * #83 afb492ce 武家屋敷通りを歩く、「みちのくの小京都」角館さんぽ
 * 日帰りプラン。企画運営(2026-10-01 06:27)の口調直し。
 * 時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "安藤醸造から武家屋敷通り、青柳家とめぐった、角館さんぽも、ここで無事に終了です。お疲れさまでした。";
const TO = "安藤醸造から武家屋敷通り、青柳家とめぐった、角館さんぽも、ここで終わりです。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'afb492ce%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "桧木内川堤" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
