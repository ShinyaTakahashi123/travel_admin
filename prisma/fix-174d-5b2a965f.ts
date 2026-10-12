/**
 * #174 5b2a965f の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 16:05、記録 98e58a1）の2点を直す
 *   ① 旧三上家住宅: 「入館は16時半までなので、時間に気をつけましょう。」は時刻なので、公式の案内で確かめる言い方にする
 *   ② 座標: 成相山パノラマ展望所 n6402084479 と 金引の滝 n832671779 はタグのない node だった（API の読み取りの誤り）。
 *      名前つきの n6402085697「成合山パノラマ展望所」（tourism=viewpoint）と n1667092389「金引の滝」（waterway=waterfall）にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-174d-5b2a965f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5b2a965f-d418-4fb0-93b5-b715252e8740";
const FROM = "入館は16時半までなので、時間に気をつけましょう。休館日は公式の案内で確かめましょう。";
const TO = "入館できる時間と休館日は、公式の案内で確かめましょう。";
const COORDS = [
  { name: "成相山パノラマ展望所", lat: 35.6007283, lng: 135.187927 },
  { name: "金引の滝", lat: 35.529359, lng: 135.182658 },
];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } }, select: { id: true, name: true, memo: true, lat: true, lng: true } });
  const one = (n: string) => {
    const h = spots.filter((s) => s.name === n);
    if (h.length !== 1) throw new Error(`${n} ${h.length}件`);
    return h[0];
  };
  const mikami = one("旧三上家住宅");
  const memo = mikami.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const neu = memo.replace(FROM, TO);
  console.log(neu);
  const plan = COORDS.map((c) => {
    const s = one(c.name);
    console.log(`${c.name}: (${s.lat}, ${s.lng}) → (${c.lat}, ${c.lng})`);
    return { id: s.id, lat: c.lat, lng: c.lng };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: mikami.id }, data: { memo: neu } });
    for (const p of plan) await tx.spot.update({ where: { id: p.id }, data: { lat: p.lat, lng: p.lng } });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
