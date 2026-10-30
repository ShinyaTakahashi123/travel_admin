/**
 * 初日・最終日の見直し #47 c97e2205 の続き（しおりえ(制作補助2)）
 * 北山十八間戸の点が案内板 node 9753844377「史跡 北山十八間戸」（information=board）そのものだったので直す（法務 10/30）。
 * OSM には建物の way 264267650「北山十八間戸」があるが Nominatim に登録がなく値が取れないため、地理院の地名「北山十八間戸」（史跡の注記の点、34.6965104,135.8357439）にする。
 * 転害門から foot 1,141m・15分（そのまま）、般若寺の楼門まで 606m・8分（いまは7分、1分の差は丸めの範囲、企画運営）で、時刻は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-047b-c97e2205.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const KITAYAMA = "4fcf1204-c2e2-4d60-adde-60350e5a897d";
const FROM: [number, number] = [34.696456, 135.835206];
const TO: [number, number] = [34.69651, 135.835744];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: KITAYAMA } });
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${TO.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: KITAYAMA }, data: { lat: TO[0], lng: TO[1] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
