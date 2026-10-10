/**
 * #41 2b09beea（那覇）企画運営の指摘。波の上ビーチ(D1-7、最後は福州園)の
 * 「1日目の締めくくりは」を通常の書き出しに修正。あわせて、読み直して見つけた
 * 既存の不具合: 奥武山公園の結びが「次は波の上ビーチへ」になっていたが、実際の
 * 次のスポットは対馬丸記念館(対馬丸記念館の書き出しも「ビーチへ向かう前に」と
 * 一致している)。奥武山公園の結びを対馬丸記念館へのつながりに修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "2b09beea-4deb-45cc-bae3-41ba5f80df2c";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "奥武山公園",
    "木陰でひと休みしたら、次は海が広がる波の上ビーチへ向かいましょう。",
    "木陰でひと休みしたら、次は対馬丸記念館へ向かいましょう。"
  );
  await replaceMemo(
    "波の上ビーチ",
    "波上宮から歩いておよそ10分、1日目の締めくくりは波の上ビーチです。",
    "波上宮から歩いておよそ10分、波の上ビーチに着きます。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
