/**
 * #136 e47d75dfの直し(5回目)。
 * ①企画運営の指摘: 石廊崎の結びで、修善寺駅前で借りたレンタカーを
 *   どこで返すか書かれていなかった。
 * ②法務の指摘: ペリーロードのまわりの座標が、下田海浜ホテルの
 *   駐車場の点だったため、ペリーロード自体の点に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "見学を終えたら、車でおよそ35分、下田駅へ向かい、帰りの電車に乗りましょう。";
const TO = "見学を終えたら、車でおよそ35分、下田駅の近くでレンタカーを返し(借りた店と別の場所で返せるか、前もって確かめましょう)、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e47d75df%'`);
  const itinId = rows[0].id;
  const irouzaki = await findSpotInItinerary(itinId, { spotName: "石廊崎" });
  const perry = await findSpotInItinerary(itinId, { spotName: "ペリーロードのまわり" });

  if (!irouzaki.memo?.includes(FROM)) throw new Error("石廊崎の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: irouzaki.id }, data: { memo: irouzaki.memo!.replace(FROM, TO) } }),
    prisma.spot.update({ where: { id: perry.id }, data: { lat: 34.671619, lng: 138.943458 } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
