/**
 * #129 cc984fa1の直し(3回目)。自己点検: fix-129bで三之堂に追加した昼食の
 * 一文に、業者名「はづき茶屋」を書いてしまっていた(決まり違反)。店名を
 * 出さない書き方に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "山上駅のそばの「はづき茶屋」など、境内には食事ができる場所もあるので、昼食をとるのもよいでしょう。";
const TO = "境内には食事ができる場所もあるので、ここで昼食にしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });

  if (!sannodo.memo?.includes(FROM)) throw new Error("三之堂の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: sannodo.id }, { memo: sannodo.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
