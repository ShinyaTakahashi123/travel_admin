/**
 * #105 66d185f1 の直し(2回目)。flow-check.cjsで「2日目に昼食の一言なし」と
 * 指摘された。ふもとっぱらの滞在(11:19〜14:49)に昼食の一言を足す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "昨日の牧場めぐりとはまた違う、雄大な草原の富士山を眺めてみてください。";
const TO = "昨日の牧場めぐりとはまた違う、雄大な草原の富士山を眺めてみてください。ここで昼食にしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66d185f1%'`);
  const itinId = rows[0].id;
  const fumotoppara = await findSpotInItinerary(itinId, { spotName: "ふもとっぱら" });
  if (!fumotoppara.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: fumotoppara.id }, { memo: fumotoppara.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
