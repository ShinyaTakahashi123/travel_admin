/**
 * #127 a4ee710d の座標の直し（しおりえ(制作補助2)、2026-10-29。法務の指摘: 度分秒から換算したとみられる値）
 * 少林山達磨寺 36.330556,138.956944（=36°19'50" 138°57'25"）→ OSM way 256525207（amenity=place_of_worship）の Nominatim の中心 36.3299126,138.9573627
 * 本文・時刻は変えない（約80mの差で、駅からの車の時間に影響しない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-coords-127.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ID = "0de37f7d-3bdf-4988-a085-efdc6bf3bdea";
const FROM: [number, number] = [36.330556, 138.956944];
const TO: [number, number] = [36.329913, 138.957363];

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: ID } });
  if (s.name !== "少林山達磨寺") throw new Error(`名前が違います（${s.name}）`);
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`${s.name}: ${s.lat},${s.lng} → ${TO.join(",")}（OSM way 256525207）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: ID }, data: { lat: TO[0], lng: TO[1] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
