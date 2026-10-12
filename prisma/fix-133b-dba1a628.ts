/**
 * #133 dba1a628の直し(2回目、自己点検)。銭洗弁財天宇賀福神社が旅の
 * 最後のスポットなのに、帰り方の一文がなかった(flow-checkの「帰りの
 * 一言なし」で発見)。鎌倉駅へ戻る一文を追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "静かに、敬意を持ってお参りしましょう。";
const TO = "静かに、敬意を持ってお参りしましょう。参拝を終えたら、歩いておよそ20分、鎌倉駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'dba1a628%'`);
  const itinId = rows[0].id;
  const zeniarai = await findSpotInItinerary(itinId, { spotName: "銭洗弁財天宇賀福神社" });

  if (!zeniarai.memo?.endsWith(FROM)) throw new Error("銭洗弁財天の結びが想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const newMemo = zeniarai.memo!.slice(0, zeniarai.memo!.length - FROM.length) + TO;
  await updateSpotInItinerary(itinId, { spotId: zeniarai.id }, { memo: newMemo });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
