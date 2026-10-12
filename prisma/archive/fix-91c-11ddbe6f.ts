/**
 * #91 11ddbe6f flow-checkが「2日目に昼食の一言なし」を検出。慶留間島・外地島には
 * 店がないため、事前に用意しておく形の昼食の一言を、窓の時間帯(11:30〜13:30)に
 * ちょうど重なる慶留間橋(12:12〜13:12)に追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "近づいたりえさを与えたりしないようにしましょう。この後は、レンタサイクルでおよそ5分、外地展望台へ向かいましょう。";
const TO =
  "近づいたりえさを与えたりしないようにしましょう。慶留間島・外地島には店がないので、昼食は阿嘉島を出る前に用意しておきましょう。橋のたもとで景色を眺めながら食べるのもよいでしょう。この後は、レンタサイクルでおよそ5分、外地展望台へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;
  const gerumabashi = await findSpotInItinerary(itinId, { spotName: "慶留間橋" });
  if (!gerumabashi.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: gerumabashi.id }, { memo: gerumabashi.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
