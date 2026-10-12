/**
 * #139 04618af3の直し(7回目、法務の気づき)。東後畑棚田の結びは
 * 「車でおよそ3分」になったが、元乃隅神社の書き出しが
 * 「東後畑棚田から車でおよそ4分」のまま残っていた。そろえる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "東後畑棚田から車でおよそ4分、元乃隅神社に着きます。";
const TO = "東後畑棚田から車でおよそ3分、元乃隅神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const motonosumi = await findSpotInItinerary(itinId, { spotName: "元乃隅神社" });

  if (!motonosumi.memo?.includes(FROM)) throw new Error("元乃隅神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: motonosumi.id }, data: { memo: motonosumi.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
