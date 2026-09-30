/**
 * #88 d1e7bf32 fix-88gの直後の直し。十和田食堂を削除した際、十和田ビジター
 * センターの書き出しが「十和田食堂から歩いておよそ6分」のまま残っていた
 * (flow-checkで発見)。ぷらっとから直接向かう書き出しに修正する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "十和田食堂から歩いておよそ6分、十和田ビジターセンターに着きます。";
const TO = "十和田湖観光交流センター「ぷらっと」から歩いておよそ22分、十和田ビジターセンターに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const vc = await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" });
  if (!vc.memo!.includes(FROM)) throw new Error("一致しません(VC)");
  const newMemo = vc.memo!.replace(FROM, TO);
  console.log("VC: OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: vc.id }, { memo: newMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
