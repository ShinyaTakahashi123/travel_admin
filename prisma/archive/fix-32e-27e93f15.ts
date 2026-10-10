/**
 * #32 27e93f15（由布院）fix-32dでCOMICO/湯の坪街道の滞在を変えた際、後ろの
 * 湯の坪街道・フローラルヴィレッジ・宇奈岐日女神社・ステンドグラス美術館・大杵社の
 * visitTimeを更新し忘れていた(stayDurationMinだけ変更)。audit「時刻の計算が合わない」
 * を受けて鎖を組み直す。
 * COMICO(09:40,85min→11:05) → +9 湯の坪街道(11:14,60min→12:14) → +4
 * フローラルヴィレッジ(12:18,90min→13:48) → +15 宇奈岐日女神社(14:03,40min→14:43)
 * → +5 ステンドグラス美術館(14:48,50min→15:38) → +16 大杵社(15:54,40min→16:34)
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

const FIXES: Array<[string, number, number]> = [
  ["湯の坪街道", 11, 14],
  ["由布院フローラルヴィレッジ", 12, 18],
  ["宇奈岐日女神社", 14, 3],
  ["由布院ステンドグラス美術館", 14, 48],
  ["大杵社", 15, 54],
];

async function main() {
  for (const [name, h, m] of FIXES) {
    const spot = await findSpotInItinerary(ITIN, { spotName: name });
    console.log(`${name}: 現在visitTime=${spot.visitTime?.toISOString().slice(11, 16)} → ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { visitTime: t(h, m) });
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
