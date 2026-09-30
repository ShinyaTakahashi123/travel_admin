/**
 * #242 0c542f79（奈良公園・東大寺）2点。
 * 1) 猿沢池の采女伝説「身を投げた」が、避けるべき自死の描写(法務の決まり、
 *    #424の対応と同様)にあたるため、最期を直接描写しない表現に言い換える。
 * 2) flow-checkで見つかった既存の不足: 単日プランに昼食の一言がなかったため
 *    興福寺(12:40〜13:20)に追加。最後の猿沢池に帰りの一言がなかったため追加。
 *    このしおり全体が丁寧なガイド口調で統一されているため、追加分も同じ口調に
 *    合わせる。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "0c542f79-2811-4a59-bfcb-34816ad72c3e";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "興福寺",
    "こちらも祈りの場ですので、どうぞ静かにお過ごしください。",
    "境内周辺には食事処もございますので、こちらで昼食にいたしましょう。こちらも祈りの場ですので、どうぞ静かにお過ごしください。"
  );
  await replaceMemo(
    "猿沢池",
    "帝の寵愛を失った采女がこの池に身を投げたという悲しい伝説が「大和物語」に残されており、その霊をお慰めするために建てられた采女神社は、今も池に背を向けて建っているといわれています。",
    "帝の寵愛を失った采女にまつわる悲しい伝説が「大和物語」に残されており、その霊をお慰めするために建てられた采女神社は、今も池に背を向けて建っているといわれています。"
  );
  await replaceMemo(
    "猿沢池",
    "これにて本日のご案内を終了とさせていただきます、お疲れ様でございました。",
    "これにて本日のご案内を終了とさせていただきます、お疲れ様でございました。お帰りは、近鉄奈良駅(徒歩5分)、またはJR奈良駅(徒歩15分)からご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
