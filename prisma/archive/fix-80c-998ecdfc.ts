/**
 * #80 998ecdfc 企画運営の指摘(2026-09-30 18:28)。広島城→縮景園だけ「車で15分」
 * になっており、ほかは全て徒歩(決まり8、移動手段の一貫性)。歩いて15分ほどの
 * 距離のため、「歩いて約15分」に統一。transitModeもcarからwalkに変更。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '998ecdfc%'`);
  const itinId = rows[0].id;

  const castle = await findSpotInItinerary(itinId, { spotName: "広島城" });
  const castleFrom = "この後は、車でおよそ15分、縮景園へ向かいましょう。";
  const castleTo = "この後は、歩いておよそ15分、縮景園へ向かいましょう。";
  if (!castle.memo!.includes(castleFrom)) throw new Error("一致しません(広島城)");
  const castleNewMemo = castle.memo!.split(castleFrom).join(castleTo);

  const shukkeien = await findSpotInItinerary(itinId, { spotName: "縮景園" });
  const shukkeienFrom = "広島城から車でおよそ15分、縮景園に着きます。";
  const shukkeienTo = "広島城から歩いておよそ15分、縮景園に着きます。";
  if (!shukkeien.memo!.includes(shukkeienFrom)) throw new Error("一致しません(縮景園)");
  const shukkeienNewMemo = shukkeien.memo!.split(shukkeienFrom).join(shukkeienTo);

  console.log("広島城: OK");
  console.log("縮景園: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: castle.id }, { memo: castleNewMemo });
  await updateSpotInItinerary(itinId, { spotId: shukkeien.id }, { memo: shukkeienNewMemo, transitMode: "walk" });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
