/**
 * #32 27e93f15（由布院）企画運営の事実確認指摘(2026-09-30 11:44): 天祖神社の
 * 「鳥居はもとはこの神社の鳥居」は誤り。複数の資料(ニッポン旅マガジン
 * https://tabi-mag.jp/ot0170/ 、お散歩ゆふいん等)で確認したところ、湖中の鳥居は
 * もとは佛山寺境内にあった金刀比羅神社の鳥居で、明治の神仏分離のあと天祖神社へ
 * 遷座・移設されたもの。本文をその内容に修正する。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "天祖神社" });
  const from = "霧に包まれた金鱗湖に浮かぶ鳥居は、もとはこの神社の鳥居で、明治の神仏分離のあと、湖の中に移されたと伝えられています。";
  const to = "霧に包まれた金鱗湖に浮かぶ鳥居は、もとは近くの佛山寺の境内にあった金刀比羅神社の鳥居で、明治の神仏分離のあと、ここへ移されたと伝えられています。";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("天祖神社: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  console.log("COMMITTED");
}
main();
