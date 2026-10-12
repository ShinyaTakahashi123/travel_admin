/**
 * #356の続き。fix-356で各スポットのvisitTimeが、前のスポットの終了時刻+移動時間を
 * 正しく積み上げられておらず、全体的に時刻がずれていた(總持寺祖院の次から、1区間分
 * 前倒しになっていた)。正しい時刻に修正する。
 *
 * 正しい時刻: 08:45 總持寺祖院(65) → 09:50 +50車 → 10:40 白米千枚田(55) → 11:35 +15車
 * → 11:50 輪島塗会館(25) → 12:15 +5車 → 12:20 道の駅輪島(55) → 13:15 +70車
 * → 14:25 見附島(55) → 15:20 +20車 → 15:40 イカの駅つくモール(50) → 16:30
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-356b-bc73fb84.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bc73fb84-1fc8-4d6f-a6a7-39a20d7f76f5";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const fixes: { name: string; time: Date }[] = [
    { name: "白米千枚田", time: T(10, 40) },
    { name: "輪島塗会館", time: T(11, 50) },
    { name: "道の駅輪島ふらっと訪夢", time: T(12, 20) },
    { name: "見附島", time: T(14, 25) },
  ];

  for (const f of fixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } } });
    if (spot.visitTime?.toISOString().slice(11, 16) === f.time.toISOString().slice(11, 16)) {
      console.log(`${f.name}: 既に対応済み`);
      continue;
    }
    await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { visitTime: f.time });
    console.log(`${f.name}: 時刻を修正`);
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
