/**
 * #127 a4ee710d の座標の直し その2（しおりえ(制作補助2)、2026-10-29。企画運営の指摘: 度分秒（0.1秒）から換算したとみられる値）
 * 高崎白衣大観音 36.310944,138.980528 → OSM node 1736439895「高崎白衣大観音」（historic=monument）36.3109646,138.9805510
 * 群馬県立近代美術館 36.298722,139.078639 → OSM node 1420713267「群馬県立近代美術館」（tourism=gallery）36.298741,139.0783112
 * 本文・時刻は変えない（どちらも約30mの差）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-coords-127b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FIX: { id: string; name: string; from: [number, number]; to: [number, number]; src: string }[] = [
  { id: "7b6b803f-5c90-40bc-82fd-c420186cb136", name: "高崎白衣大観音", from: [36.310944, 138.980528], to: [36.310965, 138.980551], src: "OSM node 1736439895" },
  { id: "4d3aa6bc-3b9c-4d01-83d1-d21aabd8f7dc", name: "群馬県立近代美術館", from: [36.298722, 139.078639], to: [36.298741, 139.078311], src: "OSM node 1420713267" },
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
