/**
 * #126 3993afce・#132 d6badcd1 の座標の直し その2（しおりえ(制作補助2)、2026-10-29）
 * 度分秒の0.1秒の形の点を探す道具を直して見直したら、OSM の点と合わない点が3つあった
 *   #126 長浜鉄道スクエア 35.376723,136.266 → OSM way 854120758「長浜鉄道スクエア」（tourism=museum）35.3768446,136.2658708
 *   #132 武田神社 35.686889,138.577472 → OSM way 226949641「武田神社」（amenity=place_of_worship）35.6867034,138.5773899（約22m）
 *   #132 甲州夢小路 35.666889,138.571389 → OSM way 226737900「甲州夢小路」（landuse=retail）35.6668571,138.5713929（約4m）
 * #124 山寺（立石寺）38.312556,140.437389 も同じ形だが、OSM way 224101452「立石寺」と約1mで、直さない
 * 本文・時刻は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-coords-126-132b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FIX: { id: string; name: string; from: [number, number]; to: [number, number]; src: string }[] = [
  { id: "2c8241e5-3efe-4ac6-a1fe-cd7e34b12308", name: "長浜鉄道スクエア", from: [35.376723, 136.266], to: [35.376845, 136.265871], src: "OSM way 854120758" },
  { id: "69f95e72-2a87-4eaf-8b5b-860fd23ea326", name: "武田神社", from: [35.686889, 138.577472], to: [35.686703, 138.57739], src: "OSM way 226949641" },
  { id: "fe2d9109-3495-40ca-a933-c3ab0aed2d17", name: "甲州夢小路", from: [35.666889, 138.571389], to: [35.666857, 138.571393], src: "OSM way 226737900" },
];

async function main() {
  for (const f of FIX) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: f.id } });
    if (s.name !== f.name) throw new Error(`${f.id}: 名前が違います（${s.name}）`);
    if (Number(s.lat) !== f.from[0] || Number(s.lng) !== f.from[1]) throw new Error(`${f.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
    console.log(`${f.name}: ${s.lat},${s.lng} → ${f.to.join(",")}（${f.src}）`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const f of FIX) await tx.spot.update({ where: { id: f.id }, data: { lat: f.to[0], lng: f.to[1] } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
