/**
 * #353の続き。法務16:03の指摘: 明善寺郷土館の「鐘楼門は享和2年(1801)ごろの建立」は、
 * 享和2年=1802年で元号と西暦が合っていなかった(享和元年=1801年)。同じ白川郷の#118
 * (制作)は「享和元年(1801)」と書いており、西暦1801年は複数の出典
 * (https://ja.wikipedia.org/wiki/明善寺 、4travel.jp等)で一貫して引用されているため、
 * ずれていたのは元号の「2年」の方だったと判断し、「享和元年(1801)」に修正した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353i-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b991287e-ca74-46a8-a190-55ce8cd37fe0";
const MEIZENJI_ID = "38b25bdb-2d4a-4d59-b2eb-7959afe92056";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: MEIZENJI_ID } });
  const old = "鐘楼門は享和2年(1801)ごろの建立で";
  const next = "鐘楼門は享和元年(1801)ごろの建立で";
  if (!spot.memo?.includes(old)) {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: MEIZENJI_ID }, { memo: spot.memo.replace(old, next) });
  console.log("明善寺郷土館: 鐘楼門の建立年を「享和元年(1801)」に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
