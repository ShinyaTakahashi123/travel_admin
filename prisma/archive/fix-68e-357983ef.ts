/**
 * #68 357983ef。企画運営の指摘: 大観峰の前後の車移動(25分/25分)は見当だったため、
 * 実際の道のり(OSRM)で確かめて直す。門前町商店街→大観峰: 16.5km/18分(OSRM)。
 * 大観峰→黒川温泉: 23.7km/33分(OSRM)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "357983ef-fff3-496a-8a92-1f236f8f24bd";

function applyReplace(memo: string, from: string, to: string, label: string) {
  if (!memo.includes(from)) throw new Error(`一致しません(${label}): ${from}`);
  return memo.split(from).join(to);
}

async function main() {
  const monzen = await findSpotInItinerary(ITIN, { spotName: "門前町商店街" });
  const monzenNewMemo = applyReplace(
    monzen.memo!,
    "この後は、車でおよそ25分、ミルクロード沿いの大観峰へ向かいましょう。",
    "この後は、車でおよそ18分、ミルクロード沿いの大観峰へ向かいましょう。",
    "門前町商店街"
  );
  console.log("門前町商店街: OK");

  const daikanbo = await findSpotInItinerary(ITIN, { spotName: "大観峰" });
  let daikanboNewMemo = applyReplace(
    daikanbo.memo!,
    "門前町商店街から車でおよそ25分、牧場地帯を抜ける「ミルクロード」沿いの大観峰に着きます。",
    "門前町商店街から車でおよそ18分、牧場地帯を抜ける「ミルクロード」沿いの大観峰に着きます。",
    "大観峰(opener)"
  );
  daikanboNewMemo = applyReplace(
    daikanboNewMemo,
    "この後は、車でおよそ25分、黒川温泉へ向かいましょう。",
    "この後は、車でおよそ33分、黒川温泉へ向かいましょう。",
    "大観峰(closer)"
  );
  console.log("大観峰: OK");

  const kurokawa = await findSpotInItinerary(ITIN, { spotName: "黒川温泉" });
  const kurokawaNewMemo = applyReplace(
    kurokawa.memo!,
    "大観峰から車でおよそ25分、旅館が軒を連ねる黒川温泉に着きます。",
    "大観峰から車でおよそ33分、旅館が軒を連ねる黒川温泉に着きます。",
    "黒川温泉"
  );
  console.log("黒川温泉: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: monzen.id }, { memo: monzenNewMemo });
  await updateSpotInItinerary(ITIN, { spotId: daikanbo.id }, { memo: daikanboNewMemo, transitDurationMin: 18 });
  await updateSpotInItinerary(ITIN, { spotId: kurokawa.id }, { memo: kurokawaNewMemo, transitDurationMin: 33, visitTime: t(15, 26) });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
