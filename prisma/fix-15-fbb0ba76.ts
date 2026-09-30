/**
 * #15 fbb0ba76 首里城と国際通り、沖縄の魅力ぎゅっと詰め込みプラン。
 * 企画運営(2026-10-01 06:27, 06:58)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'fbb0ba76%'`);
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
    "奥武山公園",
    "次にご案内するのは奥武山(おうのやま)公園です。",
    "次に訪れるのは奥武山(おうのやま)公園です。",
    "奥武山公園"
  );
  await fixOne(
    "識名園",
    "今日最後にご案内するのは識名園です。",
    "今日最後に訪れるのは識名園です。",
    "識名園"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
