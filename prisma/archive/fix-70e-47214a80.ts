/**
 * #70 47214a80。itinerary-auditで見つかった2点。
 * 1) 柏島「国内屈指のダイビングスポットとしても知られています」の「屈指」が
 *    ヘッジ語のパターンに一致しなかったため「といわれています」に修正。
 * 2) 万次郎足湯「利用は無料(タオルは有料で購入できます)です。」が料金の記載に
 *    あたるため削除。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "47214a80-9c61-4b42-bc92-b382de9581eb";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "柏島",
    "多くの魚種が生息する海として、国内屈指のダイビングスポットとしても知られています。",
    "多くの魚種が生息する海として、国内屈指のダイビングスポットともいわれています。"
  );
  await replaceMemo(
    "万次郎足湯",
    "階段状に4つの浴槽が並ぶ足湯施設で、全面ガラス張りの窓からは、青い空と太平洋、そして日本有数の大きさを誇る白山洞門を一望できます。利用は無料(タオルは有料で購入できます)です。歩き疲れた足を、大パノラマを眺めながら休めてみてください。",
    "階段状に4つの浴槽が並ぶ足湯施設で、全面ガラス張りの窓からは、青い空と太平洋、そして日本有数の大きさを誇る白山洞門を一望できます。歩き疲れた足を、大パノラマを眺めながら休めてみてください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
