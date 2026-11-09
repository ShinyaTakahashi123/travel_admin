/**
 * #91 訂正その2。fix-91-9d31758b.ts で辰鼓楼へのレグを20→24分に直したが、
 * visitTimeを更新し忘れていたため、itinerary-audit.ts で1件のずれが出た。
 * 正しい時刻(12:44)に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-91-9d31758b-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-91-9d31758b-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const UPDATES = [
  { id: "9a97a226-5644-4711-ae7d-e4bdad7b8932", name: "辰鼓楼", visitTime: t(12, 44) },
  { id: "0699606e-4757-4d02-bb91-6edc83768b4b", name: "出石城跡", visitTime: t(13, 42) },
  { id: "e3a6b494-154c-4843-b106-7f0f1ebf92bb", name: "有子山稲荷神社", visitTime: t(14, 27) },
  { id: "4adc7594-eff2-45bf-a879-88a5fc708f7b", name: "出石明治館", visitTime: t(15, 17) },
  { id: "e455278a-21ac-42c0-904a-6e6626d96000", name: "出石永楽館", visitTime: t(15, 53) },
];

async function main() {
  const commit = process.argv.includes("--commit");
  for (const u of UPDATES) {
    console.log(`${u.name}: ${String(u.visitTime.getUTCHours()).padStart(2, "0")}:${String(u.visitTime.getUTCMinutes()).padStart(2, "0")}`);
  }

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(UPDATES.map((u) => prisma.spot.update({ where: { id: u.id }, data: { visitTime: u.visitTime } })));
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
