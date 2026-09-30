/**
 * #74 6dc83721 さいたま新都心けやきひろばと三橋総合公園、都市型
 * リラックス1泊2日。企画運営(2026-10-01 06:27)の口調直し。
 * 時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
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
    "けやきひろば",
    "まずはこの都会のオアシスで、ゆったりとした時間をお楽しみください。",
    "まずはこの都会のオアシスで、ゆったりとした時間を過ごしてみてください。",
    "けやきひろば"
  );
  await fixOne(
    "鉄道博物館",
    "けやきひろばから氷川神社、大宮公園とめぐった1日目のリラックス旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。",
    "けやきひろばから氷川神社、大宮公園とめぐった1日目のリラックス旅も、ここで終わりです。今夜はこの近くの宿でゆっくり休みましょう。",
    "鉄道博物館(口調)"
  );
  await fixOne(
    "調神社",
    "けやきひろば、そしてさいたま清河寺温泉から続いた、都市型リラックス1泊2日の旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。",
    "けやきひろば、そしてさいたま清河寺温泉から続いた、都市型リラックス1泊2日の旅も、ここで終わりです。お帰りは、駐車場に置いた車でご利用ください。",
    "調神社(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
