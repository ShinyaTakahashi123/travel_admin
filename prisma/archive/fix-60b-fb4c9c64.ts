/**
 * #60 fb4c9c64（有田・伊万里）flow-checkで見つかった3点を直す。
 * 1) 有田陶磁美術館: 書き出しが「陶山神社から」のままだった(実際の一つ前はトンバイ塀
 *    のある裏通り)。以前の並べ替えの際に直し忘れていたとみられる。あわせて、
 *    12:12〜12:57が昼食の時間に当たるのに一言がなかったため追加し、次のスポット
 *    (佐賀県立九州陶磁文化館)への一言も追加(これも抜けていた)。
 * 2) Day2の最後、伊万里・有田焼伝統産業会館に帰りの一言を追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "fb4c9c64-c7cb-4f7a-addd-c6eec4080b84";

const TOJIKI_MUSEUM_MEMO_NEW =
  "トンバイ塀のある裏通りから歩いておよそ2分、有田陶磁美術館に着きます。明治7年(1874)に建てられた焼物の倉庫を改築し、昭和29年(1954)に開館した、佐賀県内で最も古い美術館のひとつとされています。館内では、県の重要文化財に指定されている「陶彫赤絵の狛犬」や「染付有田皿山職人尽し絵図大皿」など、江戸時代から昭和初期にかけての有田焼を数多く所蔵・展示しています。窯元や豪商たちが手がけた品々を通して、有田焼がたどってきた歴史の奥深さを感じてみてください。有田には食事処の店が多く集まっているので、この前後でお好みの店に立ち寄って、お昼をとるのもおすすめです。この後は、上有田駅・有田駅を経て、佐賀県立九州陶磁文化館へ向かいましょう。";

async function main() {
  const museum = await findSpotInItinerary(ITIN, { spotName: "有田陶磁美術館" });
  console.log("有田陶磁美術館: OK(書き換え)");

  const sangyokaikan = await findSpotInItinerary(ITIN, { spotName: "伊万里・有田焼伝統産業会館" });
  const from = "有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史を学ぶ1泊2日をお楽しみいただけたことでしょう。";
  const to = "有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史を学ぶ1泊2日をお楽しみいただけたことでしょう。お帰りは、伊万里駅からのバス・電車をご利用ください。";
  if (!sangyokaikan.memo!.includes(from)) throw new Error("一致しません(伝統産業会館)");
  const newSangyokaikanMemo = sangyokaikan.memo!.split(from).join(to);
  console.log("伊万里・有田焼伝統産業会館: OK(帰りの一言追加)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: museum.id }, { memo: TOJIKI_MUSEUM_MEMO_NEW });
  await updateSpotInItinerary(ITIN, { spotId: sangyokaikan.id }, { memo: newSangyokaikanMemo });
  console.log("COMMITTED");
}
main();
