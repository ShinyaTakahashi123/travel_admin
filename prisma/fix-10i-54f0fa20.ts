/**
 * #10 54f0fa20の直し(9回目)。企画運営の指摘: 日本城郭研究センターの結びが
 * 「歩いておよそ15分」のままだった(好古園側の書き出しは7分に直したが、
 * 対になる結びの文を直し忘れていた)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "この後は、歩いておよそ15分、好古園へ向かいましょう。";
const TO = "この後は、歩いておよそ7分、好古園へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;
  const jokaku = await findSpotInItinerary(itinId, { spotName: "日本城郭研究センター" });

  if (!jokaku.memo?.includes(FROM)) throw new Error("日本城郭研究センターの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: jokaku.id }, { memo: jokaku.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
