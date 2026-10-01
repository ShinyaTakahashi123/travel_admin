/**
 * #492 443379ac の座標の直し（しおりえ(制作補助2)、2026-10-01 #200 の見直しで気づいた）
 * - 石舞台古墳の座標（34.4661,135.8228）が OSM の石舞台古墳 way 1455208274（34.4668488,135.8261444）から約300m西にずれていたので直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-492c-443379ac.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "443379ac-eac1-427a-859b-34aaece19786";
const SPOT_ID = "30f9d0c6-c111-484a-bda8-67d8ab33366b";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID }, include: { day: true } });
  if (s.day.itineraryId !== ITINERARY_ID || s.name !== "石舞台古墳" || s.lat !== 34.4661 || s.lng !== 135.8228) throw new Error("想定と違います");
  console.log(`${s.name}: (${s.lat},${s.lng}) → (34.4668488,135.8261444)`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { lat: 34.4668488, lng: 135.8261444 } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
