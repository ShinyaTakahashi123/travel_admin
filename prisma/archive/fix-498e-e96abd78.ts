/**
 * #498 e96abd78 の座標の直し（しおりえ(制作補助2)、#217 の見直しのときに気づいた）
 * 1日目の堺町通りが、OSM の地名の点「堺町」node 6222614840（推定）になっていた。地名の点は使わない決まりなので、
 *   OSM の道「堺町通り」way 205065353 の Nominatim の中心 43.194351,141.0060723 に直す（#217 と同じ点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-498e-e96abd78.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const SPOT_ID = "d3b349e1-c050-4271-81f9-1582766b5f89";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
  if (s.name !== "堺町通り" || Math.abs(Number(s.lat) - 43.196163) > 1e-5 || Math.abs(Number(s.lng) - 141.005032) > 1e-5) throw new Error(`想定と違います: ${s.name} ${s.lat},${s.lng}`);
  console.log(`${s.name}: ${s.lat},${s.lng} → 43.194351,141.0060723`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { lat: 43.194351, lng: 141.0060723 } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
