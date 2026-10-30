/**
 * #90 鎌倉1泊2日の訂正その2。fix-90-dba1a628.ts で2日目のレグ・滞在だけ直し、
 * visitTime を更新し忘れていたため、itinerary-audit.ts で6件のずれが出た。
 * 正しい時刻に直す(並び順・スポットIDは変更しない)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-90-dba1a628-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-90-dba1a628-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const UPDATES = [
  { id: "76b2e2fd-510c-42e4-b0e3-2a8b9c35f016", name: "甘縄神明神社", visitTime: t(9, 30) },
  { id: "de6ccb4b-8775-477d-bf89-a01ae8c5e91e", name: "高徳院", visitTime: t(10, 20) },
  { id: "648aa595-8790-431f-b1de-296f76e8b9df", name: "長谷寺", visitTime: t(11, 10) },
  { id: "34a8aa15-565d-41a5-9f8c-5adc6045cb50", name: "長谷駅のまわり", visitTime: t(12, 31) },
  { id: "f101abaa-8e63-40c7-aa34-25cd61978f67", name: "御霊神社", visitTime: t(13, 36) },
  { id: "e27fcc38-eb77-4050-afb3-4d4ed61e52f3", name: "成就院", visitTime: t(14, 17) },
  { id: "cd9db71c-0509-4dca-b42f-a2ba145fe518", name: "虚空蔵堂", visitTime: t(14, 48) },
  { id: "62d9358e-1486-42c1-97ae-38b7eea12e8e", name: "銭洗弁財天宇賀福神社", visitTime: t(15, 50) },
];

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #90 訂正その2: 2日目のvisitTimeを直す ===");
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
