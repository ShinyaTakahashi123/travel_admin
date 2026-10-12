/**
 * #132 d45c6b3bの直し(7回目、自己点検)。白石城の結び「白石蔵王駅で
 * レンタカーを返しましょう」が、flow-checkの「帰りの一言」の決まった
 * 言い方(駅へ/駅まで/駅から/戻り等)に当てはまらず「帰りの一言なし」と
 * 出た。「白石蔵王駅へ戻り、レンタカーを返しましょう」に言い換える。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "見学を終えたら、車でおよそ5分、白石蔵王駅でレンタカーを返しましょう。";
const TO = "見学を終えたら、車でおよそ5分、白石蔵王駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;
  const shiroishijo = await findSpotInItinerary(itinId, { spotName: "白石城" });

  if (!shiroishijo.memo?.includes(FROM)) throw new Error("白石城の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: shiroishijo.id }, { memo: shiroishijo.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
