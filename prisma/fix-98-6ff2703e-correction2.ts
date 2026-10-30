/**
 * #98 訂正その2。fix-98-6ff2703e.ts で住吉大社・阿倍王子神社のtransitLegsを
 * 個別に直すのを忘れていた(LEG_UPDATESに2スポットの行を入れ忘れ、itinerary-audit.tsで
 * 発覚。メモの文言だけ直り、実際のtransitLegsの分数は元のままだった)。
 *
 * 住吉大社: walk3+train20+walk2 → walk2+train16+walk4
 * 阿倍王子神社: walk2+train12+walk5 → walk4+train5+walk4
 * あわせて、transitLineの「阪堺電車」も「路面電車」に直す(法務の指摘)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-98-6ff2703e-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-98-6ff2703e-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const LEG_UPDATES: { id: string; label: string; min: number; line?: string }[] = [
  { id: "5181c186-10d2-4a8c-aef7-bcf8939c12b7", label: "住吉大社 walk1(ハルカス→天王寺駅前)", min: 2 },
  {
    id: "db608211-336b-4c42-ad6d-12bf838dbc8b",
    label: "住吉大社 train(天王寺駅前→住吉鳥居前)",
    min: 16,
    line: "路面電車上町線（天王寺駅前→住吉鳥居前）",
  },
  { id: "c1bebc4c-9dfd-4246-ac08-26c1359efee6", label: "住吉大社 walk2(住吉鳥居前→住吉大社)", min: 4 },
  { id: "91295bc3-bc06-4f49-a1fc-5c5dc4be13c7", label: "阿倍王子神社 walk1(住吉大社→住吉鳥居前)", min: 4 },
  {
    id: "2b83662c-cd48-4a1a-ae95-0a2bd3b889b4",
    label: "阿倍王子神社 train(住吉鳥居前→東天下茶屋)",
    min: 5,
    line: "路面電車上町線（住吉鳥居前→東天下茶屋）",
  },
  { id: "d59aae89-ef20-4ea4-ac9d-a1dba62f0be9", label: "阿倍王子神社 walk2(東天下茶屋→阿倍王子神社)", min: 4 },
];

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #98 訂正その2: 住吉大社・阿倍王子神社のtransitLegs ===");
  for (const l of LEG_UPDATES) {
    console.log(`  ${l.label}: ${l.min}分${l.line ? ` (${l.line})` : ""}`);
  }

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    LEG_UPDATES.map((l) =>
      prisma.spotTransitLeg.update({
        where: { id: l.id },
        data: { transitDurationMin: l.min, ...(l.line ? { transitLine: l.line } : {}) },
      })
    )
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
