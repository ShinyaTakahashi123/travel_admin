/**
 * #61 af71a6c9 の追加の直し（しおりえ(制作補助2)、10/30。点だけ・法務のOKで書き込む）
 * 金沢21世紀美術館の点 36.560833,136.658194 は度分秒の0.1秒の形（36°33'39.0"・136°39'29.5"）→ OSM「金沢２１世紀美術館」way 197980653 の値 36.560838,136.65821（約2m）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-061b-af71a6c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const NIJU = "2856b7de-6116-41ad-bc01-585195d0f192";
const FROM: [number, number] = [36.560833, 136.658194];
const TO: [number, number] = [36.560838, 136.65821];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: NIJU } });
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`${s.name}: ${FROM.join(",")} → ${TO.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: NIJU }, data: { lat: TO[0], lng: TO[1] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
