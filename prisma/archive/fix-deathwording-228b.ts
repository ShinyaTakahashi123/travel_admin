/**
 * 法務(23:35)の追加指摘。#228 ea3cdd43 飯盛山で、「落城と思い込み」と
 * 「亡くなった」を直接つないでいる文が、亡くなり方を思わせるとの指摘。
 * 思い込みの経緯と「実際には〜」の一文を外し、亡くなったことだけを
 * 端的に伝える書き方にする。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "戊辰戦争のさなか、少年たちで編成された白虎隊士中二番隊が、戦場からの退却の途中この山にたどり着き、遠くに見えた煙を鶴ヶ城の落城と思い込み、この地で亡くなったと伝えられています(この経緯には諸説あります)。実際には城は落城していませんでした。";
const TO = "戊辰戦争で戦場から退いた白虎隊士中二番隊の少年たちが、この地で亡くなったと伝えられています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'ea3cdd43%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "飯盛山" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
