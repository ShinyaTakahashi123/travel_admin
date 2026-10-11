/**
 * #10 54f0fa20の直し(2回目)。itinerary-audit.cjsの指摘: 男山配水池公園の
 * 「姫路市内で最も古い配水池」に、同じ文の中で伝聞の語がなかった。
 * (「水増し?」の指摘は、198段の石段という高低差のある移動のため、
 * 直線距離ベースの判定が実態と合わない誤検知と判断)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "姫路市内で最も古い配水池を中心とした公園で、";
const TO = "姫路市内で最も古いとされる配水池を中心とした公園で、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;
  const otokoyama = await findSpotInItinerary(itinId, { spotName: "男山配水池公園" });

  if (!otokoyama.memo?.includes(FROM)) throw new Error("男山配水池公園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: otokoyama.id }, { memo: otokoyama.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
