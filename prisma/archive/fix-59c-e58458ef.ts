/**
 * #59 e58458ef（松島）fix-59bのaudit確認で「徒歩が速すぎ」が出た点を修正。
 * ザ・ミュージアムMATSUSHIMA→西行戻しの松公園の距離は実際には1.3km(直線)あり、
 * 11分では速すぎる(7.1km/h相当)。17分(4.6km/h相当)に直し、後続の時刻も送らせる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "e58458ef-7755-49bc-8828-7b35e20a8244";

const FIXES: Array<[string, number, number, number?]> = [
  ["西行戻しの松公園", 12, 51],
  ["観瀾亭", 13, 34],
  ["五大堂", 14, 21],
  ["福浦島", 15, 2],
  ["雄島", 16, 2],
];

async function main() {
  const park = await findSpotInItinerary(ITIN, { spotName: "西行戻しの松公園" });
  console.log("西行戻しの松公園 現在transitDurationMin:", park.transitDurationMin, "→ 17");

  for (const [name, h, m] of FIXES) {
    const spot = await findSpotInItinerary(ITIN, { spotName: name });
    console.log(`${name}: 現在visitTime=${spot.visitTime?.toISOString().slice(11, 16)} → ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: park.id }, { transitDurationMin: 17 });
  for (const [name, h, m] of FIXES) {
    const spot = await findSpotInItinerary(ITIN, { spotName: name });
    await updateSpotInItinerary(ITIN, { spotId: spot.id }, { visitTime: t(h, m) });
  }
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
