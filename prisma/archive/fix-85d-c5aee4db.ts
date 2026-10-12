/**
 * #85 c5aee4db fix-85cで智恩寺の移動手段をcar→walkに直したが、本文が
 * 「車でおよそ10分」のままだったため、文言も歩きに合わせる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "智恩寺" });
  const from = "天橋立ビューランドから車でおよそ10分、天橋立のたもとに立つ智恩寺に着きます。";
  const to = "天橋立ビューランドから歩いておよそ10分、天橋立のたもとに立つ智恩寺に着きます。";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("智恩寺: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
