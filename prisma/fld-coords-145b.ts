/**
 * #145 9f58d4de の座標の直し その2（しおりえ(制作補助2)、2026-10-30。法務の指摘: 0.1秒単位の度分秒から換算した形）
 * 坂本八幡宮 33.516778,130.513472（=33°31′00.4″ 130°30′48.5″）→ OSM node 1204189118「坂本八幡宮」（amenity=place_of_worship）33.5167742,130.5134753
 * 本文・時刻は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-coords-145b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ID = "32cc9e46-a255-475d-a07b-827c9b01ffa2";
const FROM: [number, number] = [33.516778, 130.513472];
const TO: [number, number] = [33.516774, 130.513475];

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: ID } });
  if (s.name !== "坂本八幡宮") throw new Error(`名前が違います（${s.name}）`);
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`${s.name}: ${s.lat},${s.lng} → ${TO.join(",")}（OSM node 1204189118）`);
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
