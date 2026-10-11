/**
 * #129 cc984fa1の直し(9回目)。企画運営(2026-10-11、企✅後の小さな直し、
 * 報告不要)。開山堂の「駅周辺で昼食をとっておくとよいでしょう」が案内の
 * 口調だったため、標準の言い方に変更。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "姫路駅で乗り換える際に、駅周辺で昼食をとっておくとよいでしょう。";
const TO = "姫路駅で乗り換える際に、駅のまわりで昼食をとりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });

  if (!kaizando.memo?.includes(FROM)) throw new Error("開山堂の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kaizando.id }, { memo: kaizando.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
