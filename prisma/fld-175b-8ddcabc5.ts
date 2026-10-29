/**
 * 初日・最終日の見直し #175 8ddcabc5 の続き（しおりえ(制作補助2)）
 * 道の駅青雲橋の点を、fld-175 で地理院の注記の点にしたが、OSM に way 975311341「道の駅「青雲橋」」（highway=services）があり、
 * 道の駅は highway=services の way の中心を使う決まり（itinerary-rules 365）なので、その Nominatim（32.6605803,131.3884686）に戻す（法務 10/30）。
 * もとの値と同じ（srccheck の近くの候補に出ず、見落とした）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-175b-8ddcabc5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const SEIUN = "2ce47b13-f551-4ae0-ba1a-87dfd2a704ab";
const FROM: [number, number] = [32.66064, 131.388496];
const TO: [number, number] = [32.66058, 131.388469];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: SEIUN } });
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${TO.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: SEIUN }, data: { lat: TO[0], lng: TO[1] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
