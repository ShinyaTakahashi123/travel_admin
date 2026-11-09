/**
 * #39 6dc83721 の追加の直し（しおりえ(制作補助2)、法務 10/30 19:17。点だけ、時刻・移動・文は変えない）
 * 埼玉県立歴史と民俗の博物館: 地理院の番地 → OSM「埼玉県立歴史と民族の博物館」way 292288984（「民族」は OSM 側の書き間違い。Nominatim 35.9213319,139.6303385）
 * routed-foot: 大宮公園駅のまわり→博物館 695m 9.3分（10のまま）、博物館→盆栽美術館 1,343m 17.9分（18のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-039b-6dc83721.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const MUSEUM = "294d158f-3854-4e86-afd6-8190a7da937d";
const COMMIT = process.argv.includes("--commit");
const FROM: [number, number] = [35.921021, 139.630447];
const TO: [number, number] = [35.9213319, 139.6303385];

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: MUSEUM } });
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`■ ${s.name}\n  座標 ${s.lat},${s.lng} → ${TO[0]},${TO[1]}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: MUSEUM }, data: { lat: TO[0], lng: TO[1] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
