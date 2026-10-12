/**
 * #326の続き。fix-326fの実行後、itinerary-auditで4件の「時刻の計算が
 * 合わない」を検出(自己チェック)。西の河原公園(D1)・草津温泉スキー場/
 * 温泉図書館/道の駅(D2)のvisitTime更新漏れ・誤りを、itineraryIdで
 * 絞った形で直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326g-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function setTime(name: string, h: number, m: number) {
  const s = await prisma.spot.findFirstOrThrow({ where: { name, day: { itineraryId: ITIN_ID } } });
  const cur = s.visitTime!.getUTCHours() * 60 + s.visitTime!.getUTCMinutes();
  const want = h * 60 + m;
  if (cur === want) {
    console.log(name, "already correct");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, h, m)) });
  console.log(name, cur, "->", want);
}

async function main() {
  await setTime("西の河原公園・露天風呂", 14, 54);
  await setTime("草津温泉スキー場", 10, 55);
  await setTime("温泉図書館", 11, 50);
  await setTime("道の駅 草津運動茶屋公園", 14, 58);
  await setTime("西の河原通り", 15, 58);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
