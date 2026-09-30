/**
 * #24 657f4a15（箱根）企画運営の指摘(2026-09-30 10:52): 各日に昼食の一言がない。
 * Day1は彫刻の森美術館(10:57〜11:57、館内にレストランあり)に、Day2は成川美術館
 * (11:19〜12:24、ティーラウンジ「季節風」で軽食あり)に一言を追加。滞在は延ばさない
 * ため時刻はずれない。あわせて、成川美術館の本文が旧い並び("続いては恩賜箱根公園へ")
 * のままだったのを、fix-24gの新しい並び(次は箱根旧街道杉並木)に合わせて修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "彫刻の森美術館",
    "屋外・屋内の両方でじっくりと芸術に浸れる場所です。この後は",
    "屋外・屋内の両方でじっくりと芸術に浸れる場所です。園内にはレストランがあるので、散策の途中でお昼を挟むのもおすすめです。この後は"
  );
  await replaceMemo(
    "成川美術館",
    "ガラス張りの展望ラウンジからは、芦ノ湖の絶景を眺めながらひと息つくこともでき、絵画鑑賞と芦ノ湖の景色の両方を楽しめる場所です。続いては恩賜箱根公園へ向かいましょう。",
    "ガラス張りの展望ラウンジからは、芦ノ湖の絶景を眺めながらひと息つくこともでき、軽食もいただけるので、ここでお昼をとるのもおすすめです。絵画鑑賞と芦ノ湖の景色の両方を楽しめる場所です。この後は、歩いておよそ3分、箱根旧街道杉並木へ向かいましょう。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
