/**
 * #263の続き。fix-263bで2日目のvisitTimeの積算を一部誤り、桜島・仙巌園・
 * 尚古集成館の到着が直前のスポットの終了時刻と合っていなかった
 * (時刻の計算が合わない)。正しい値に修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-263c-1f5e18c2.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "1f5e18c2-61b0-4697-aa5f-8067bab107f5";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const fixes: { name: string; time: [number, number] }[] = [
    { name: "桜島", time: [10, 15] },
    { name: "仙巌園", time: [12, 22] },
    { name: "尚古集成館", time: [14, 13] },
  ];
  for (const f of fixes) {
    const s = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } } });
    const target = t(f.time[0], f.time[1]);
    if (s.visitTime?.getTime() !== target.getTime()) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: target });
      console.log(`${f.name} visitTime -> ${f.time[0]}:${f.time[1]}`);
    } else {
      console.log(`${f.name} already correct`);
    }
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
