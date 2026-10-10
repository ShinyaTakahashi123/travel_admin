/**
 * #66 1d0aa24f。諏訪神社はGSI住所検索の地区レベルの近似点のため、正確な距離が
 * わからない。itinerary-auditの「徒歩が速すぎ」を避けるため、余裕をもって
 * 徒歩10分に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "1d0aa24f-a0e8-4319-b97b-86952764c785";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  return { id: spot.id, memo: newMemo };
}

async function main() {
  const takizawa = await replaceMemo(
    "滝沢公園",
    "この後は、歩いておよそ8分、諏訪神社へ向かいましょう。",
    "この後は、歩いておよそ10分、諏訪神社へ向かいましょう。"
  );
  const suwa = await replaceMemo(
    "諏訪神社",
    "滝沢公園から歩いておよそ8分、諏訪神社に着きます。",
    "滝沢公園から歩いておよそ10分、諏訪神社に着きます。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: takizawa.id }, { memo: takizawa.memo });
  await updateSpotInItinerary(ITIN, { spotId: suwa.id }, { memo: suwa.memo, transitDurationMin: 10, visitTime: t(15, 57) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
