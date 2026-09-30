/**
 * #60 fb4c9c64（有田・伊万里）fix-60eの見落とし2点をaudit・flow-checkで発見・修正。
 * 1) 伊萬里神社のvisitTimeを更新し忘れ、前(町なか)との時刻計算が合っていなかった。
 * 2) 大川内山の窯元通りの書き出しが「伊万里鍋島焼会館から」のままだったが、
 *    並べ替え後の実際の一つ前は鍋島藩窯公園。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "fb4c9c64-c7cb-4f7a-addd-c6eec4080b84";

async function main() {
  const jinja = await findSpotInItinerary(ITIN, { spotName: "伊萬里神社" });
  console.log("伊萬里神社 現在visitTime:", jinja.visitTime?.toISOString().slice(11, 16), "→ 11:25");

  const kamamotodori = await findSpotInItinerary(ITIN, { spotName: "大川内山の窯元通り" });
  const from = "伊万里鍋島焼会館から歩いておよそ4分、大川内山の窯元通りに着きます。";
  const to = "鍋島藩窯公園から歩いておよそ4分、大川内山の窯元通りに着きます。";
  if (!kamamotodori.memo!.includes(from)) throw new Error("一致しません(窯元通り)");
  const newKamamotodoriMemo = kamamotodori.memo!.split(from).join(to);
  console.log("窯元通り: OK(書き出し修正)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: jinja.id }, { visitTime: t(11, 25) });
  await updateSpotInItinerary(ITIN, { spotId: kamamotodori.id }, { memo: newKamamotodoriMemo });
  console.log("COMMITTED");
}
main();
