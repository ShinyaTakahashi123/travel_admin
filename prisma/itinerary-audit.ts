/**
 * 時刻の鎖の確認: 各日、前のスポットの到着+滞在+移動 = 次のスポットの到着 になっているかを
 * 確かめる。--commit の前に必ず通す(企画運営 2026-10-30、#84での計算違いを受けて追加)。
 *
 * 使い方: npm run prod -- npx tsx prisma/itinerary-audit.ts <itineraryId>
 */
import { prisma } from "../src/lib/prisma";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
function minutesOf(d: Date) {
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

async function main() {
  const itineraryId = process.argv[2];
  if (!itineraryId) {
    console.error("使い方: npx tsx prisma/itinerary-audit.ts <itineraryId>");
    process.exit(1);
  }

  const days = await prisma.day.findMany({
    where: { itineraryId },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true } } },
  });

  let errorCount = 0;
  for (const day of days) {
    console.log(`\n=== Day ${day.dayNumber} ===`);
    let prevDepartMin: number | null = null;
    for (const s of day.spots) {
      const leg = s.transitLegs[0];
      const arriveMin = s.visitTime ? minutesOf(s.visitTime) : null;
      let note = "";
      if (prevDepartMin !== null && leg && leg.transitDurationMin !== null && arriveMin !== null) {
        const expected: number = prevDepartMin + leg.transitDurationMin;
        if (expected !== arriveMin) {
          const eh = String(Math.floor(expected / 60)).padStart(2, "0");
          const em = String(expected % 60).padStart(2, "0");
          note = `  [ずれ] 期待=${eh}:${em} 実際=${s.visitTime ? hm(s.visitTime) : "?"}`;
          errorCount++;
        }
      }
      console.log(
        `${s.visitTime ? hm(s.visitTime) : "?"} ${leg ? `${leg.transitMode}/${leg.transitDurationMin}` : "-"} ${s.name}(${s.stayDurationMin}分)${note}`
      );
      if (arriveMin !== null && s.stayDurationMin !== null) {
        prevDepartMin = arriveMin + s.stayDurationMin;
      } else {
        prevDepartMin = null;
      }
    }
  }
  console.log(`\nずれ: ${errorCount}件`);
  if (errorCount > 0) process.exitCode = 1;
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
