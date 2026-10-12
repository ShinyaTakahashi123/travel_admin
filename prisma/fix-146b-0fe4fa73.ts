/**
 * #146 0fe4fa73の直し(2回目、自己点検)。最後のスポット(金の湯)に
 * 帰りの一言がなかったため追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "湯上がりは、有馬の温泉街で外湯めぐりや射的、温泉まんじゅうの食べ歩きなど、思い思いに湯の町の風情を楽しみましょう。";
const TO = "湯上がりは、有馬の温泉街で外湯めぐりや射的、温泉まんじゅうの食べ歩きなど、思い思いに湯の町の風情を楽しみましょう。帰りは、神戸電鉄の有馬温泉駅から電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const kinnoyu = await findSpotInItinerary(itinId, { spotName: "金の湯" });

  if (!kinnoyu.memo?.includes(FROM)) throw new Error("金の湯の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: kinnoyu.id }, data: { memo: kinnoyu.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
