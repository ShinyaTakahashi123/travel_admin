/**
 * #76 7ec2843d 法務の気づき(2026-10-01 06:54)。最後のスポットの結びで、
 * 夜の工場夜景クルーズを宣伝口調(「参加してみるのもおすすめです」)で
 * すすめていた。決まり6の形(一言で案内するだけ)にあわせ、宣伝口調を外す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "日が暮れてから時間に余裕があれば、赤レンガ倉庫周辺から出航する、京浜工業地帯の幻想的な明かりを船上から眺める工場夜景クルーズに参加してみるのもおすすめです。";
const TO =
  "日が暮れてから時間に余裕があれば、赤レンガ倉庫周辺から、京浜工業地帯の明かりを船上から眺める工場夜景クルーズが出航することがあります(運航状況は公式サイトで確かめましょう)。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7ec2843d%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "象の鼻パーク・大さん橋" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
