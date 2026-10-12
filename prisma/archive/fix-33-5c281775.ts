/**
 * #33 5c281775 もみじ回廊と富士山。河口湖の紅葉と絶景をめぐる日帰り旅。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5c281775%'`);
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
    "河口湖〜富士山パノラマロープウェイ",
    "山頂での絶景をごゆっくりお楽しみください。",
    "山頂での絶景をごゆっくり楽しんでください。",
    "河口湖〜富士山パノラマロープウェイ"
  );
  await fixOne(
    "久保田一竹美術館",
    "館内の作品とあわせて、庭園の景色もゆっくりとご覧ください。",
    "館内の作品とあわせて、庭園の景色もゆっくりと眺めてください。",
    "久保田一竹美術館"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
