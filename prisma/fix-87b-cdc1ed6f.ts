/**
 * #87 cdc1ed6f flow-checkの指摘。1日目に昼食の一言がなかったため、
 * 時間帯がちょうど正午をまたぐ旧徳島城表御殿庭園のあと(バラ園・数寄屋橋の
 * 手前)に追加。徳島中央公園の周辺(両国本町・徳島駅前方面)には飲食店が
 * 多いため、そのあたりで昼食をとる想定の一言とする。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cdc1ed6f%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "旧徳島城表御殿庭園" });
  const from = "静かに、庭園ならではの趣を味わってください。";
  const to = "静かに、庭園ならではの趣を味わってください。公園の周辺には食事処も多いので、この付近で昼食にするのもおすすめです。";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("旧徳島城表御殿庭園: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
