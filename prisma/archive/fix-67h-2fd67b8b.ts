/**
 * #67 2fd67b8b。itinerary-auditの言い切り検知。西の丸庭園「市内屈指の桜の名所
 * として知られています」の「として知られています」がヘッジ語のパターンに
 * 一致しなかったため、「といわれています」に修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "西の丸庭園" });
  const from = "現在はおよそ600本のソメイヨシノが植えられた、市内屈指の桜の名所として知られています。";
  const to = "現在はおよそ600本のソメイヨシノが植えられた、市内屈指の桜の名所といわれています。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("西の丸庭園: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
