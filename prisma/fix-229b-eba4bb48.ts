/**
 * #229 eba4bb48 の追いの直し（しおりえ(制作補助2)）
 * 観世音寺→井戸神社は約0.2kmなので、歩き15分→5分（観世音寺の滞在を40分にし、あとの時刻は変えない）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-229b-eba4bb48.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "eba4bb48-2fcd-41ad-a10a-e602a2778fe2";
const COMMIT = process.argv.includes("--commit");
const F = "観世音寺から歩いて約15分。";
const T = "観世音寺から歩いて約5分。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: { in: ["観世音寺", "井戸神社"] } } });
  const kan = spots.find((s) => s.name === "観世音寺");
  const ido = spots.find((s) => s.name === "井戸神社");
  if (!kan || !ido || !(ido.memo ?? "").includes(F)) throw new Error("構成が想定と違います");
  const memo = ido.memo!.replace(F, T);
  console.log(`観世音寺: 滞在40分\n井戸神社: walk5\n${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: kan.id }, data: { stayDurationMin: 40 } }),
    prisma.spot.update({ where: { id: ido.id }, data: { memo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] } } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
