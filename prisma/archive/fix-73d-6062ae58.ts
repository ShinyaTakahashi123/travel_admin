/**
 * #73 6062ae58 岡山城、烏城と呼ばれる漆黒の天守を望む定番日帰りプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6062ae58%'`);
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
    "岡山城",
    "旭川のほとりに立つ漆黒の天守を、じっくりとご覧ください。",
    "旭川のほとりに立つ漆黒の天守を、じっくりと眺めてください。",
    "岡山城"
  );
  await fixOne(
    "西川緑道公園",
    "岡山城、烏城と呼ばれる漆黒の天守を望む定番日帰りプランも、ここで無事に終了です。お疲れさまでした。",
    "岡山城、烏城と呼ばれる漆黒の天守を望む定番日帰りプランも、ここで終わりです。",
    "西川緑道公園(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
