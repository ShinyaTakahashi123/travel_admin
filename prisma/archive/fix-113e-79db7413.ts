/**
 * #113 79db7413の直し(5回目)。企画運営(15:33)の指摘。五稜郭タワーの
 * 「レンタカーは、ここまでに返却しておきましょう」は、タワーまで
 * 車で来ているのに「ここまでに」では返す場所・時間が分からない。
 * 見学後、車で函館駅前まで戻って返却する形に書き直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "レンタカーは、ここまでに返却しておきましょう。今夜は函館市内の宿に泊まり、旅の疲れを癒やしましょう。";
const TO = "見学を終えたら、車でおよそ15分の函館駅前でレンタカーを返し、函館市内の宿へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '79db7413%'`);
  const itinId = rows[0].id;
  const tower = await findSpotInItinerary(itinId, { spotName: "五稜郭タワー" });

  if (!tower.memo!.includes(FROM)) throw new Error("五稜郭タワーの文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tower.id }, { memo: tower.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
