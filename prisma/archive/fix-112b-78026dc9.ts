/**
 * #112 78026dc9の直し(2回目)。itinerary-audit.cjsの言い切りチェックで、
 * 千畳閣の「現存する宮島最大の木造建築です」に、同じ文中のヘッジが
 * なく引っかかったため直す。五重塔の「位置が前とほぼ同じ」(40m)は、
 * 千畳閣と隣接する別の建物であるための想定内の誤検知として扱う。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "畳857枚分もの広さを持つ、現存する宮島最大の木造建築です。";
const TO = "畳857枚分もの広さを持つ、現存する宮島最大の木造建築とされています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const senjokaku = await findSpotInItinerary(itinId, { spotName: "千畳閣" });

  if (!senjokaku.memo!.includes(FROM)) throw new Error("千畳閣の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: senjokaku.id }, { memo: senjokaku.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
