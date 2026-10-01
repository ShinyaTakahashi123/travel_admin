/**
 * #203 a71cf39b（松山）・#378 dc8d9ae8（宮古島の橋）の座標の直し（しおりえ(制作補助2)、2026-10-01 企画運営・法務の共通のお願い「前からあるスポットの丸めた座標も直す」）
 * 自分が見直した #200〜#211 と、そこに出てくるしおりの座標を調べ、丸めた値が残っていた2か所を OSM の点に直す:
 *   #203 大街道: 33.8395,132.766（丸め）→ OSM way 237265571「大街道」（highway=pedestrian、アーケード）の Nominatim の中心 33.8386908,132.7701017
 *   #378 渡口の浜: 24.81154,125.18（丸め）→ OSM way 1007334758「渡口の浜」（natural=beach）の Nominatim の中心 24.8115325,125.1779407
 * （#202 雄島 36.250666,136.119723 は度分秒に見えたが、大湊神社 way 585913985 の Nominatim の中心そのものなので直さない）
 * 本文と時刻は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-203c-378b-rounded-coords.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FIXES: [string, string, [number, number], [number, number]][] = [
  ["d93e962b-ec9a-4908-8053-a4644ab0b106", "大街道", [33.8395, 132.766], [33.8386908, 132.7701017]],
  ["11cd2b56-49eb-4062-bc60-11f988a9959c", "渡口の浜", [24.81154, 125.18], [24.8115325, 125.1779407]],
];

async function main() {
  for (const [id, name, [lat0, lng0], [lat, lng]] of FIXES) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    if (s.name !== name || Math.abs(Number(s.lat) - lat0) > 1e-5 || Math.abs(Number(s.lng) - lng0) > 1e-5) throw new Error(`想定と違います: ${s.name} ${s.lat},${s.lng}`);
    console.log(`${name}: ${lat0},${lng0} → ${lat},${lng}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [id, , , [lat, lng]] of FIXES) await tx.spot.update({ where: { id }, data: { lat, lng } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
