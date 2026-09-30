/**
 * #336の続き。fix-336cで出石永楽館側の「3分」は直したが、出石明治館側の
 * 結び「続いては、歩いておよそ3分の出石永楽館へ」も同じ理由(3→6分)で
 * 直し忘れていた。つなぎを合わせる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-336d-9d31758b.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d31758b-13cf-4d8c-bbdd-87a0361b36db";

async function main() {
  const meijikan = await prisma.spot.findFirstOrThrow({ where: { name: "出石明治館", day: { itineraryId: ITIN_ID } } });
  const old = "続いては、歩いておよそ3分の出石永楽館へ向かいましょう。";
  const next = "続いては、歩いておよそ6分の出石永楽館へ向かいましょう。";
  if (meijikan.memo?.includes(next)) {
    console.log("already fixed");
  } else {
    if (!meijikan.memo?.includes(old)) throw new Error("text not found");
    await updateSpotInItinerary(ITIN_ID, { spotId: meijikan.id }, { memo: meijikan.memo.replace(old, next) });
    console.log("meijikan forward-line fixed to 6分");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
