/**
 * #343の続き。企画運営11:00の指摘対応。fix-343dで綿貫観音山古墳→群馬県立
 * 近代美術館の移動時間を3分→12分に直した際、近代美術館側の書き出しは
 * 直したが、綿貫観音山古墳側の結びの文に古い「3分」が残っていた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-343e-a4ee710d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd";

async function main() {
  const kofun = await prisma.spot.findFirstOrThrow({ where: { name: "綿貫観音山古墳", day: { itineraryId: ITIN_ID } } });

  const old = "続いては、歩いておよそ3分の群馬県立近代美術館へ向かいましょう。";
  const next = "続いては、歩いておよそ12分の群馬県立近代美術館へ向かいましょう。";

  if (!kofun.memo?.includes(old)) {
    if (kofun.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: kofun.id }, { memo: kofun.memo.replace(old, next) });
  console.log("kofun closing line updated to 12分");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
