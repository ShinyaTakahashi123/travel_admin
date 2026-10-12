/**
 * #37 41e37fe5 企画運営の指摘(14:54)3点。
 * 1) 田尻歴史館の開館日: 田尻町公式サイトで確認したところ、休館は毎週水曜日と
 *    12/29〜1/3のみ(9:00〜18:00開館)で、「週に数日のみ」ではなかった。事実と
 *    異なるため、実際の開館状況(水曜休館)にもとづく一言に留める。
 * 2) 二色の浜公園: 特定施設の宣伝・年入りの「最近の話」(グランピング施設の一文)を削除。
 * 3) さかい利晶の杜: 「あくまで再現された建物であり…」の一文を短く整理。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "41e37fe5-383f-47ff-9375-dda356f10a9a";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "田尻歴史館",
    "当時の面影を残す建物を、ゆっくりと見学してみてください。",
    "当時の面影を残す建物を、ゆっくりと見学してみてください。休館日(毎週水曜日など)があるので、訪れる前に公式サイトで確かめましょう。"
  );
  await replaceMemo(
    "二色の浜公園",
    "公園の周辺には食事処もあるので、ここで昼食にしましょう。2025年9月には園内にグランピング施設「うみテラス二色の浜」もオープンし、日帰りだけでなく宿泊で自然を楽しむ過ごし方もできるようになりました。",
    "公園の周辺には食事処もあるので、ここで昼食にしましょう。"
  );
  await replaceMemo(
    "さかい利晶の杜",
    "1階の「千利休茶の湯館」には、京都・妙喜庵に現存する国宝の茶室「待庵」を再現した「さかい待庵」が設けられていますが、これはあくまで再現された建物であり、国宝の実物ではない点は知っておくとよいでしょう。",
    "1階の「千利休茶の湯館」には、京都・妙喜庵に現存する国宝の茶室「待庵」を再現した「さかい待庵」があります。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
