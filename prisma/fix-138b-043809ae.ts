/**
 * #138 043809aeの直し(2回目、自己点検)。真栄田岬の「最大の見どころは」が
 * itinerary-auditの「言い切り?」で検出された(最大=言い切りの語)。
 * 同じ文の中にぼかしを入れる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "最大の見どころは、海水の浸食によって自然にできた海食洞、通称「青の洞窟」です。";
const TO = "最大の見どころとされるのが、海水の浸食によって自然にできた海食洞、通称「青の洞窟」です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '043809ae%'`);
  const itinId = rows[0].id;
  const maeda = await findSpotInItinerary(itinId, { spotName: "真栄田岬" });

  if (!maeda.memo?.includes(FROM)) throw new Error("真栄田岬の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: maeda.id }, data: { memo: maeda.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
