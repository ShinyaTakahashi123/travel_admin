/**
 * #60 fb4c9c64（有田・伊万里）自分のミスの復旧。fix-60cで伊萬里神社のmemoを
 * 「書き出しの一文だけ」で丸ごと上書きしてしまい、由緒・配慮の一文・結びが
 * すべて消えていた(prayer-checkで発覚)。元の本文(書き出し以外は変更なし)に、
 * 新しい書き出し(伊万里駅前から歩いておよそ11分)だけを反映して復元する。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "fb4c9c64-c7cb-4f7a-addd-c6eec4080b84";

const RESTORED_MEMO =
  "伊万里駅前から歩いておよそ11分、伊萬里神社に着きます。伊万里の町を見守る総鎮守として、岩栗山に鎮座する神社です。香橘神社・岩栗神社・戸渡嶋神社の3社が合祀され、昭和37年(1962)に今の伊萬里神社となりました。本殿は江戸時代前期の建築を今に伝えています。境内には、常世の国から橘の実を持ち帰ったと伝わる田道間守命をまつる中嶋神社もあり、「お菓子の神様」として親しまれています。伊万里の出身で森永製菓を創業した森永太一郎の像も立っています。静かに、敬意をもってお参りください。この後は、バスでおよそ20分、秘窯の里・大川内山にある鍋島藩窯公園へ向かいましょう。";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "伊萬里神社" });
  console.log("現在(壊れている状態):", spot.memo);
  console.log("復元後:", RESTORED_MEMO);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: RESTORED_MEMO });
  console.log("COMMITTED");
}
main();
