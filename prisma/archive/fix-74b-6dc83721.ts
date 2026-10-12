/**
 * #74 6dc83721。itinerary-audit・flow-checkで見つかった2点。
 * 1) 大宮公園小動物園「入園無料の」が料金の記載にあたるため削除。
 * 2) 鉄道博物館(D1最後)に宿への一言がなかったため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN_PREFIX = "6dc83721";

async function replaceMemo(itinId: string, name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(itinId, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  const { prisma } = await import("../src/lib/prisma");
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${ITIN_PREFIX}%'`);
  const itinId = rows[0].id;

  await replaceMemo(
    itinId,
    "大宮公園小動物園",
    "入園無料の小さな動物園で、ツキノワグマやブチハイエナといった猛獣から、シシオザルやケナガクモザルなどの珍しいサルまで、身近に見学できます。",
    "小さな動物園で、ツキノワグマやブチハイエナといった猛獣から、シシオザルやケナガクモザルなどの珍しいサルまで、身近に見学できます。"
  );
  await replaceMemo(
    itinId,
    "鉄道博物館",
    "けやきひろばから氷川神社、大宮公園とめぐった1日目のリラックス旅も、ここで無事に終了です。お疲れさまでした。",
    "けやきひろばから氷川神社、大宮公園とめぐった1日目のリラックス旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
  await prisma.$disconnect();
}
main();
