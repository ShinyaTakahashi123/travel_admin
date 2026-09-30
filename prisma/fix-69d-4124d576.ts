/**
 * #69 4124d576 熊野古道 大門坂、世界遺産の参詣道を歩く定番日帰りプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "補陀洛山寺・大門坂・那智の滝・青岸渡寺・熊野那智大社と巡った、世界遺産の参詣道と那智勝浦・太地の海をめぐる旅も、ここで無事に終了です。お疲れさまでした。お帰りは、バスなどで紀伊勝浦駅方面へ戻りましょう。";
const TO =
  "補陀洛山寺・大門坂・那智の滝・青岸渡寺・熊野那智大社と巡った、世界遺産の参詣道と那智勝浦・太地の海をめぐる旅も、ここで終わりです。お帰りは、バスなどで紀伊勝浦駅方面へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '4124d576%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "太地町立くじらの博物館" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
