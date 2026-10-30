/**
 * #48 函館の見直しに続く、ほかの函館のしおりの点のそろえ（しおりえ(制作補助2)、企画運営 10/30「そろえます（同じ場所は同じ点）」）
 * 座標だけの直しで、前後の移動の分数・時刻は変えない（法務のOKで書き込み、企画運営 10/30）
 * - 896c41e3 五稜郭公園: 公園の中心（way 39635898）→ 一の橋（way 955948102、#48・bb3ae76a と同じ）。タワーから foot 229m・3.1分、奉行所まで 257m・3.4分（いまはどちらも5分）
 * - 896c41e3 八幡坂: 道の線の点（way 41111885）→ node 5329294424（tourism=attraction、#48・78eab247 と同じ）。金森から 661m・8.8分（いまは10分）、公会堂まで 300m・4.0分（いまは5分）
 * - bb3ae76a（#2）・c09412a7 函館市文学館: 出どころの分からない点 → museum の node 5840008497（#48 と同じ）。朝市から 18.9分（いまと同じ、点を動かしても変わらない）、公会堂まで 7.4分（同じ）
 * - 79db7413（#48）函館市地域交流まちづくりセンター: way の点 → node 2474761532（法務 10/30）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-048b-align-hakodate.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ROWS: { it: string; id: string; from: [number, number]; to: [number, number] }[] = [
  { it: "896c41e3", id: "12ba6711-bffb-46b8-9072-3f8e823e6f7a", from: [41.7969, 140.757156], to: [41.795602, 140.754953] },
  { it: "896c41e3", id: "b501c3b8-8056-44b7-ab88-eca00c804a37", from: [41.764732, 140.712734], to: [41.763794, 140.711773] },
  { it: "bb3ae76a", id: "8f04f23f-62b4-45e3-8c82-d52335795f1f", from: [41.766266, 140.713211], to: [41.766387, 140.713249] },
  { it: "c09412a7", id: "5b7893f4-e384-4000-a7fa-dc3279c4bdf5", from: [41.766266, 140.713211], to: [41.766387, 140.713249] },
  // #48 79db7413 まちづくりセンター: 建物の way 261053988 → 施設の node 2474761532（amenity=townhall、約10m。法務 10/30、歩きの分数は変わらない）
  { it: "79db7413", id: "66d87ea8-21ad-40bf-995e-172a93a7ac75", from: [41.763721, 140.716955], to: [41.763795, 140.71689] },
];

async function main() {
  for (const r of ROWS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: r.id }, include: { day: { select: { itineraryId: true } } } });
    if (!s.day.itineraryId.startsWith(r.it)) throw new Error(`${s.name}: しおりが想定と違います`);
    if (Number(s.lat) !== r.from[0] || Number(s.lng) !== r.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
    console.log(`${r.it} ${s.name}: ${s.lat},${s.lng} → ${r.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ROWS.map((r) => prisma.spot.update({ where: { id: r.id }, data: { lat: r.to[0], lng: r.to[1] } })));
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
