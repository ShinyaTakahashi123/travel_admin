/**
 * #343の続き。企画運営13:01の指摘対応。群馬県立歴史博物館の結びが
 * 「歩いておよそ3分」のままで、群馬の森公園側の書き出し「5分」と
 * 合っていなかった。5分に揃える。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-343g-a4ee710d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd";

async function main() {
  const rekishi = await prisma.spot.findFirstOrThrow({ where: { name: "群馬県立歴史博物館", day: { itineraryId: ITIN_ID } } });

  const old = "見学を終えたら、歩いておよそ3分の群馬の森公園へ向かいましょう。";
  const next = "見学を終えたら、歩いておよそ5分の群馬の森公園へ向かいましょう。";

  if (!rekishi.memo?.includes(old)) {
    if (rekishi.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: rekishi.id }, { memo: rekishi.memo.replace(old, next) });
  console.log("rekishi closing line fixed to 5分");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
