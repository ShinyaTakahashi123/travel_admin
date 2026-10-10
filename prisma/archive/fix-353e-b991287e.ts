/**
 * #353の続き。fix-353cで民家園の座標を修正した結果、民家園→明善寺の
 * 実際の距離が0.72kmから0.47kmに変わり、既存の「歩いて20分」という記述が
 * 徒歩速度として不自然(1.5km/h、itinerary-auditで検出)になっていることが
 * 判明。実際の距離に見合う9分に修正し、浮いた11分は民家園の滞在時間に
 * 加えて(115→126分)、後続のすべての時刻がずれないようにした。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353e-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b991287e-ca74-46a8-a190-55ce8cd37fe0";

async function main() {
  const minkaen = await prisma.spot.findFirstOrThrow({ where: { name: "野外博物館合掌造り民家園", day: { itineraryId: ITIN_ID } } });
  const meizenji = await prisma.spot.findFirstOrThrow({ where: { name: "明善寺郷土館", day: { itineraryId: ITIN_ID } } });

  if (minkaen.stayDurationMin === 126) {
    console.log("already applied, skipping");
    return;
  }

  const memoOld = "見学を終えたら、歩いておよそ20分の明善寺郷土館へ向かいましょう。";
  const memoNext = "見学を終えたら、歩いておよそ9分の明善寺郷土館へ向かいましょう。";
  if (!minkaen.memo?.includes(memoOld)) throw new Error("民家園: anchor not found");

  const meizenjiOpenerOld = "野外博物館合掌造り民家園を見学したら、歩いておよそ20分の明善寺郷土館へ向かいましょう。";
  const meizenjiOpenerNext = "野外博物館合掌造り民家園を見学したら、歩いておよそ9分の明善寺郷土館へ向かいましょう。";
  if (!meizenji.memo?.includes(meizenjiOpenerOld)) throw new Error("明善寺: anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: minkaen.id }, { memo: minkaen.memo.replace(memoOld, memoNext), stayDurationMin: 126 });
  await updateSpotInItinerary(ITIN_ID, { spotId: meizenji.id }, { memo: meizenji.memo.replace(meizenjiOpenerOld, meizenjiOpenerNext), transitDurationMin: 9 });

  console.log("民家園→明善寺の移動時間を9分に修正、民家園の滞在を126分に調整(後続の時刻は不変)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
