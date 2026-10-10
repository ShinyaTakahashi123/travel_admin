/**
 * #111 76714b9fの直し(3回目)。flow-check.cjsで養浩館庭園(最終日の最後の
 * スポット)に「帰りの一言なし」の指摘。「福井駅でレンタカーを返却」
 * だけでは帰り方の一言として拾われなかったため、「帰りの電車」を明記。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "福井の海と歴史をめぐる旅はこれで終わりです。福井駅でレンタカーを返却しましょう。";
const TO = "福井の海と歴史をめぐる旅はこれで終わりです。福井駅でレンタカーを返却し、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76714b9f%'`);
  const itinId = rows[0].id;
  const yokokan = await findSpotInItinerary(itinId, { spotName: "養浩館庭園" });

  if (!yokokan.memo!.includes(FROM)) throw new Error("養浩館庭園の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: yokokan.id }, { memo: yokokan.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
