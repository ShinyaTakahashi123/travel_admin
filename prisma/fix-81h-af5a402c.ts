/**
 * #81 af5a402c 仙台市博物館と牛たん通り、歴史とグルメを楽しむ1泊2日。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af5a402c%'`);
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
    "仙台市博物館",
    "仙台の歴史にじっくりと触れていただいたら、続いてはすぐそばの仙台城跡へとご案内いたします。",
    "仙台の歴史にじっくりと触れたら、続いてはすぐそばの仙台城跡へ向かいましょう。",
    "仙台市博物館"
  );
  await fixOne(
    "瑞鳳殿",
    "仙台東照宮から輪王寺、大崎八幡宮、伊達家ゆかりの地をめぐった歴史をたどる1日目は、ここで終了です。お疲れさまでした。今夜は仙台市内の宿でゆっくりお休みください。",
    "仙台東照宮から輪王寺、大崎八幡宮、伊達家ゆかりの地をめぐった歴史をたどる1日目は、ここで終わりです。今夜は仙台市内の宿でゆっくりお休みください。",
    "瑞鳳殿(口調)"
  );
  await fixOne(
    "榴岡公園",
    "公園の散策とあわせて、ゆっくりとお楽しみください。杜の都・仙台の歴史と文化をめぐった2日目の旅も、ここで終了です。お疲れさまでした。お帰りは、JR仙台駅からご利用ください。",
    "公園の散策とあわせて、ゆっくりと楽しんでください。杜の都・仙台の歴史と文化をめぐった2日目の旅も、ここで終わりです。お帰りは、JR仙台駅からご利用ください。",
    "榴岡公園"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
