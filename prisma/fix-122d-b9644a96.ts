/**
 * #122 b9644a96の直し(4回目)。fix-122cで「数百本ともいわれる」を削除した
 * ことで、文中のヘッジ語が無くなり、itinerary-audit.cjsが「言い切り?」を
 * 新たに検知した。「日本三名園に数えられる」に「とされる」を補う。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "日本三名園に数えられる、";
const TO = "日本三名園の一つとされる、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b9644a96%'`);
  const itinId = rows[0].id;
  const kenrokuen = await findSpotInItinerary(itinId, { spotName: "兼六園" });
  if (!kenrokuen.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: kenrokuen.id }, { memo: kenrokuen.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
