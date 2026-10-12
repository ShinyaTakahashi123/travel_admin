/**
 * #135 e3e32914（門司港レトロ）企画運営の指摘。出光美術館(門司)(D2-8、最後は三宜楼)の
 * 「旅の締めくくりに」を通常の書き出しに修正。あわせて読み直して見つけた既存の
 * 不具合: 門司港駅の結びが「続いては九州鉄道記念館へ」になっていたが、実際の
 * 次のスポットは海峡プラザ(海峡プラザ側の書き出しも「門司港駅から」と一致)。
 * 門司港駅の結びを海峡プラザへのつながりに修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "e3e32914-5c7e-4d4c-94ae-c0c0598cdaf1";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "門司港駅",
    "大正ロマンあふれる駅舎の佇まいを、ゆっくりと眺めてください。続いては九州鉄道記念館へ向かいましょう。",
    "大正ロマンあふれる駅舎の佇まいを、ゆっくりと眺めてください。続いては海峡プラザへ向かいましょう。"
  );
  await replaceMemo(
    "出光美術館（門司）",
    "大正・昭和ロマンあふれる洋館建築を巡る旅の締めくくりに、静かに作品と向き合うひとときを過ごしてください。",
    "大正・昭和ロマンあふれる洋館建築を眺めてきた旅の合間に、静かに作品と向き合うひとときを過ごしてください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
