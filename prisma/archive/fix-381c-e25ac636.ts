/** #381 e25ac636 企画運営の指摘: 人道の位置を下関側の人道入口に戻し、滞在10分、人道→和布刈神社を徒歩20分（トンネル約15分＋出口から約5分）に。しおりえ(制作補助2)。使い方: npm run prod -- npx tsx prisma/fix-381c-e25ac636.ts [--commit] */
import { prisma } from "../src/lib/prisma";
const ITINERARY_ID = "e25ac636-ba75-49d3-a911-11a08c9df4d0";
async function main() {
  const jindo = await prisma.spot.findFirstOrThrow({ where: { name: "関門トンネル人道", day: { itineraryId: ITINERARY_ID } } });
  const mekari = await prisma.spot.findFirstOrThrow({ where: { name: "和布刈神社", day: { itineraryId: ITINERARY_ID } } });
  console.log(`人道 ${jindo.lat},${jindo.lng} 滞在${jindo.stayDurationMin} → 33.96556,130.95606 滞在10 / 和布刈神社 移動${mekari.transitMode}${mekari.transitDurationMin} → walk20（到着 11:55 は変わらず）`);
  if (!process.argv.includes("--commit")) return console.log("確認モード");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: jindo.id }, data: { lat: 33.96556, lng: 130.95606, stayDurationMin: 10 } }),
    prisma.spot.update({ where: { id: mekari.id }, data: { transitMode: "walk", transitDurationMin: 20 } }),
  ]);
  console.log("書き込みました。");
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());
