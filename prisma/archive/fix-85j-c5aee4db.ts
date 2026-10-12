/**
 * #85 c5aee4db 天橋立と伊根の舟屋、海と絶景の丹後めぐり旅。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "天橋立から伊根の舟屋、丹後ちりめんの町並みまでめぐった2日間の旅は、ここで終了です。お疲れさまでした。お帰りは、車で丹後半島をあとにしましょう。";
const TO = "天橋立から伊根の舟屋、丹後ちりめんの町並みまでめぐった2日間の旅は、ここで終わりです。お帰りは、車で丹後半島をあとにしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "旧尾藤家住宅" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
