/**
 * #2 bb3ae76a 函館八幡宮の祈りの一文を決まりの形（rules 238）に直す（しおりえ(制作補助2)、fld-002b のあとに気づいた自分の誤り。文だけの直し）
 * あわせて、トラピスチヌ修道院の点 41.78785,140.822514（出どころ不明）を OSM の way 241420140 の Nominatim の値 41.787577,140.822574 に（法務 10/30）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-002c-bb3ae76a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TRAP = "e55d7238-6366-4316-82e7-187fc8c46c39";
const TRAP_FROM: [number, number] = [41.78785, 140.822514];
const TRAP_TO: [number, number] = [41.787577, 140.822574];
const COMMIT = process.argv.includes("--commit");
const ID = "72a0da56-4d25-4327-8b61-3034e3ff177a";
const FROM = "神社では、静かにお参りしましょう。";
const TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: ID }, include: { day: { select: { itineraryId: true } } } });
  if (!s.day.itineraryId.startsWith("bb3ae76a") || s.name !== "函館八幡宮" || (s.memo ?? "").split(FROM).length !== 2) throw new Error("いまの文が想定と違います");
  console.log(`${s.name}: ${FROM} → ${TO}`);
  const tr = await prisma.spot.findUniqueOrThrow({ where: { id: TRAP } });
  if (Number(tr.lat) !== TRAP_FROM[0] || Number(tr.lng) !== TRAP_FROM[1]) throw new Error(`${tr.name}: いまの座標が想定と違います`);
  console.log(`${tr.name}: ${TRAP_FROM.join(",")} → ${TRAP_TO.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: ID }, data: { memo: s.memo!.replace(FROM, TO) } }),
    prisma.spot.update({ where: { id: TRAP }, data: { lat: TRAP_TO[0], lng: TRAP_TO[1] } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
