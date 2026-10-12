/**
 * #81 af5a402c itinerary-auditの指摘。東北大学史料館のメモに「土日祝日」
 * という曜日・祝日の言い回しがあり、家のルール(曜日は書かない決まり)に
 * ひっかかった。「平日のみの開館」という表現に整理。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af5a402c%'`);
  const itinId = rows[0].id;

  const spot = await findSpotInItinerary(itinId, { spotName: "東北大学史料館" });
  const from = "開館は平日のみで、土日祝日と夏期休業・年末年始は休館のため、訪れる前に公式サイトで確かめましょう。";
  const to = "開館は平日のみのため、訪れる前に公式サイトで確かめましょう。";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("東北大学史料館: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
