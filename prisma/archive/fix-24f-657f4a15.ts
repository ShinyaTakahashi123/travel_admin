/**
 * #24 657f4a15（箱根）fix-24eで箱根美術館の滞在を20→45分にした際、後ろの
 * 強羅公園・彫刻の森美術館のvisitTimeを更新し忘れていた（stayDurationMinだけ変更）。
 * audit で「時刻の計算が合わない」が出たため、鎖を組み直す。
 * 箱根美術館(09:30,stay45→10:15) → +3 強羅公園(10:18,stay30→10:48)
 * → +9 彫刻の森美術館(10:57,stay60→11:57) → +15 早雲山駅(12:12、変更なし、以降も一致)。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const goraPark = await findSpotInItinerary(ITIN, { spotName: "強羅公園" });
  const chokoku = await findSpotInItinerary(ITIN, { spotName: "彫刻の森美術館" });
  console.log("強羅公園 現在visitTime:", goraPark.visitTime?.toISOString().slice(11, 16));
  console.log("彫刻の森美術館 現在visitTime:", chokoku.visitTime?.toISOString().slice(11, 16));

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: goraPark.id }, { visitTime: t(10, 18) });
  await updateSpotInItinerary(ITIN, { spotId: chokoku.id }, { visitTime: t(10, 57) });
  console.log("COMMITTED");
}

main();
