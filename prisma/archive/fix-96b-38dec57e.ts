/**
 * #96 38dec57e fix-96の直後の直し。itinerary-audit.cjsの言い切り検出に
 * ひっかかった2か所(「三大」「初めて」)をぼかす。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '38dec57e%'`);
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
    "南京町",
    "横浜中華街・長崎新地中華街とあわせて日本三大中華街のひとつに数えられています。",
    "横浜中華街・長崎新地中華街とあわせて、日本三大中華街のひとつとされています。",
    "南京町"
  );
  await fixOne(
    "神戸ルミナリエ",
    "同年12月に初めて開催された光の祭典です。",
    "同年12月から始まった光の祭典です。",
    "神戸ルミナリエ"
  );
  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
