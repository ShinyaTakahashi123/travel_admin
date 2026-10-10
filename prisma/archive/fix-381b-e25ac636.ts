/** #381 e25ac636 関門トンネル人道の位置を、トンネルの中ほど(OSM)に直す（滞在の中でトンネルを歩くため）。しおりえ(制作補助2)。使い方: npm run prod -- npx tsx prisma/fix-381b-e25ac636.ts [--commit] */
import { prisma } from "../src/lib/prisma";
const ITINERARY_ID = "e25ac636-ba75-49d3-a911-11a08c9df4d0";
async function main() {
  const sp = await prisma.spot.findFirstOrThrow({ where: { name: "関門トンネル人道", day: { itineraryId: ITINERARY_ID } } });
  console.log(`${sp.id} ${sp.lat},${sp.lng} → 33.96333,130.95957`);
  if (!process.argv.includes("--commit")) return console.log("確認モード");
  await prisma.spot.update({ where: { id: sp.id }, data: { lat: 33.96333, lng: 130.95957 } });
  console.log("書き込みました。");
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());
