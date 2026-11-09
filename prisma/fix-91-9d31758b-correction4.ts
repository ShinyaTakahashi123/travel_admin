/**
 * #91 訂正その4。correction3で文芸館→ロープウェイの徒歩を15→10分に直したが、
 * ロープウェイ以降のvisitTimeを更新し忘れていたため、itinerary-audit.tsで
 * 1件のずれが出た(以降すべて5分早まる)。初日の時刻を連動させて直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-91-9d31758b-correction4.ts
 *   反映: npm run prod -- npx tsx prisma/fix-91-9d31758b-correction4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const UPDATES = [
  { id: "af0777ba-b67e-495e-8054-6db61432bf8d", name: "城崎温泉ロープウェイ", visitTime: t(11, 20) },
  { id: "ade9fdb9-a7fd-4fff-97aa-e39531dda3af", name: "温泉寺", visitTime: t(11, 50) },
  { name: "城崎の温泉街で昼食", visitTime: t(12, 45) },
  { id: "475ab79e-bb50-4b18-880a-3d69e6ea34e8", name: "御所の湯", visitTime: t(13, 35) },
  { id: "09a6b3df-6ef9-4ad9-aae7-1b3b6ea60003", name: "一の湯", visitTime: t(14, 34) },
  { id: "9371b3c7-ca2d-43ff-b608-0ad43e152a6b", name: "地蔵湯", visitTime: t(15, 54) },
  { id: "18a015d9-3ff4-400a-9eac-91d723f2c0b3", name: "柳湯", visitTime: t(16, 30) },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const lunch = await prisma.spot.findFirstOrThrow({ where: { name: "城崎の温泉街で昼食" } });
  const targets = UPDATES.map((u) => (u.id ? u : { ...u, id: lunch.id }));

  for (const u of targets) {
    console.log(`${u.name}: ${String(u.visitTime.getUTCHours()).padStart(2, "0")}:${String(u.visitTime.getUTCMinutes()).padStart(2, "0")}`);
  }
  console.log("終了16:55");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(targets.map((u) => prisma.spot.update({ where: { id: u.id }, data: { visitTime: u.visitTime } })));
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
