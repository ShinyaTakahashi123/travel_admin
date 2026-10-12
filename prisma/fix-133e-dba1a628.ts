/**
 * #133 dba1a628の直し(5回目)。企画運営の指摘。
 * 浄智寺の結び「歩いておよそ12分、建長寺へ」が、実際の移動時間(16分)と
 * 合っていなかった(fix-133cでtransitLegを16分に直した際、本文を直し忘れた)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "この後は、歩いておよそ12分、建長寺へ向かいましょう。";
const TO = "この後は、歩いておよそ16分、建長寺へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'dba1a628%'`);
  const itinId = rows[0].id;
  const joxhiji = await findSpotInItinerary(itinId, { spotName: "浄智寺" });

  if (!joxhiji.memo?.includes(FROM)) throw new Error("浄智寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: joxhiji.id }, data: { memo: joxhiji.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
