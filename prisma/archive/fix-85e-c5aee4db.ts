/**
 * #85 c5aee4db prayer-checkの判定語は「敬意」「手を合わせ」のみ(「静かに」は
 * 9/29に企画運営の指摘で対象外)。丹後国分寺跡のfix-85cでの追加が「静かに」
 * だけだったため、「敬意」を含む形に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "丹後国分寺跡" });
  const from = "かつてこの地に大きな伽藍があったことに思いをはせながら、静かに歩いてみてください。";
  const to = "かつてこの地に大きな伽藍があったことに思いをはせながら、敬意をもって歩いてみてください。";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("丹後国分寺跡: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
