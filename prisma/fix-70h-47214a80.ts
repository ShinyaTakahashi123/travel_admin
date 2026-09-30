/**
 * #70 47214a80 竜串海岸とジョン万次郎資料館、足摺の海中美と歴史をめぐる旅。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '47214a80%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "竜串グラスボート・見残し海岸",
    "竜串海岸から見残し海岸まで、太古の地球が刻んだ造形美と、生きたサンゴの海を、あわせてお楽しみください。",
    "竜串海岸から見残し海岸まで、太古の地球が刻んだ造形美と、生きたサンゴの海を、あわせて楽しんでください。",
    "竜串グラスボート・見残し海岸"
  );
  await fixOne(
    "柏島",
    "竜串海岸から続いた足摺の海中美をめぐる旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。",
    "竜串海岸から続いた足摺の海中美をめぐる旅も、ここで終わりです。今夜はこの近くの宿でゆっくり休みましょう。",
    "柏島(口調)"
  );
  await fixOne(
    "足摺岬",
    "竜串海岸から続いた足摺の海中美と歴史をめぐる旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。",
    "竜串海岸から続いた足摺の海中美と歴史をめぐる旅も、ここで終わりです。お帰りは、駐車場に置いた車でご利用ください。",
    "足摺岬(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
