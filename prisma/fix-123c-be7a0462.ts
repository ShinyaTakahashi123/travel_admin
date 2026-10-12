/**
 * #123 be7a0462の直し(3回目)。itinerary-audit.cjsの「言い切り?」のうち、
 * 丸岡城「北陸地方では唯一の現存天守です」は実際に言い切りなので、
 * 伝聞に弱める(maruoka-castle.jp公式で確認した事実だが、プロジェクトの
 * 慣例に合わせてヘッジする)。
 * 一筆啓上日本一短い手紙の館・旧森田銀行本店の⚠は、施設の固有名
 * 「日本一短い手紙の館」自体に「日本一」の文字が含まれるための誤検知
 * (施設名はヘッジできない)。直さない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "北陸地方では唯一の現存天守です。";
const TO = "北陸地方では唯一の現存天守とされています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;
  const maruoka = await findSpotInItinerary(itinId, { spotName: "丸岡城" });
  if (!maruoka.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: maruoka.id }, { memo: maruoka.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
