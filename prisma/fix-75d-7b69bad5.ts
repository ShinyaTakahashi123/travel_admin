/**
 * #75 7b69bad5 股のぞきで有名な天橋立、南北の絶景を1日で巡るプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "天橋立の南北の絶景に、宮津の商家文化を加えた1日をめぐる旅も、ここで無事に終了です。お疲れさまでした。お帰りは、バスやタクシーなどで天橋立駅方面へ向かいましょう。";
const TO = "天橋立の南北の絶景に、宮津の商家文化を加えた1日をめぐる旅も、ここで終わりです。お帰りは、バスやタクシーなどで天橋立駅方面へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7b69bad5%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "旧三上家住宅" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
