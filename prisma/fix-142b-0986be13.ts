/**
 * #142 0986be13の直し(4回目、自己点検)。十分一番所跡から徳良湖で
 * walk→carに手段が変わるが、車への乗り方の説明がなかった。
 * 十分一番所跡は銀山温泉の入り口にあたる史跡(=温泉街の駐車場がある
 * あたり)なので、そこで車に乗る一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "かつての賑わいを物語る、小さな史跡です。この後は、車でおよそ12分、徳良湖へ向かいましょう。";
const TO = "かつての賑わいを物語る、小さな史跡です。このあたりの駐車場に車を置いている場合は、ここから車に乗りましょう。この後は、車でおよそ12分、徳良湖へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0986be13%'`);
  const itinId = rows[0].id;
  const juubu = await findSpotInItinerary(itinId, { spotName: "十分一番所跡" });

  if (!juubu.memo?.includes(FROM)) throw new Error("十分一番所跡の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: juubu.id }, data: { memo: juubu.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
