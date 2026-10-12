/**
 * #138 043809aeの直し(6回目)。法務の指摘。
 * 嘉数高台公園は沖縄戦の激戦地で、園内に慰霊碑もあるのに
 * 「静かに見学しましょう」だけで、しのぶ一文がなかった。
 * 慰霊の一文と、陣地壕に入らない一文を追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "園内には、当時の陣地壕の一部も残っています。静かに見学しましょう。";
const TO = "園内には、当時の陣地壕の一部も残っていますが、中には入らないようにしましょう。慰霊碑もあり、亡くなった方々をしのぶ場所でもあるので、静かに、敬意を持って見学しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '043809ae%'`);
  const itinId = rows[0].id;
  const kakazu = await findSpotInItinerary(itinId, { spotName: "嘉数高台公園" });

  if (!kakazu.memo?.includes(FROM)) throw new Error("嘉数高台公園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: kakazu.id }, data: { memo: kakazu.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
