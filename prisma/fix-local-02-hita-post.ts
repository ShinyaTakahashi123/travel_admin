/**
 * seed-local-02-hita.ts の登録直後に行う、季節(seasons)と区間の直し。
 * handmade-genには季節を付ける仕組みがなく、1スポットに1区間しか持てないため、
 * 別スクリプトで同じ確認の中で行う(itinerary-rules.md433-434行、2026-11-02企画運営の決定)。
 *
 * ①季節: タイトルの主な題材(史跡・町並み・陶芸の里)は特定の季節のものではないため、
 *   季節を問わない内容として春夏秋冬の4つを付ける。
 * ②区間: 「豆田の辻公園→小鹿田焼の里」は、実際は「歩いて日田駅まで戻る(OSRM徒歩23分)→
 *   バスでおよそ40分」の2区間。登録時は1区間(other 63分)だったため、2区間に分ける。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "597de6fa-205e-48ac-b805-558c50b5a069";
const SEASONS = ["spring", "summer", "autumn", "winter"];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  console.log(`対象: ${itin.title} (${itin.id})`);
  console.log(`現在のseasons: ${JSON.stringify(itin.seasons)}`);
  console.log(`新しいseasons: ${JSON.stringify(SEASONS)}(季節を問わない内容のため4つ)`);

  const onta = await prisma.spot.findFirstOrThrow({
    where: { name: "小鹿田焼の里", day: { itineraryId: ITIN_ID } },
    include: { transitLegs: true },
  });
  console.log(`\n[小鹿田焼の里] 現在の区間: ${JSON.stringify(onta.transitLegs.map((l) => ({ mode: l.transitMode, min: l.transitDurationMin })))}`);
  console.log(`新しい区間: walk23分(日田駅まで) → bus40分(終点まで)`);
  if (onta.transitLegs.length !== 1 || onta.transitLegs[0].transitMode !== "other" || onta.transitLegs[0].transitDurationMin !== 63) {
    throw new Error("小鹿田焼の里: 区間の現在値が期待と不一致");
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { seasons: SEASONS } });
    await tx.spotTransitLeg.deleteMany({ where: { spotId: onta.id } });
    await tx.spotTransitLeg.createMany({
      data: [
        { spotId: onta.id, orderNo: 1, transitMode: "walk", transitDurationMin: 23 },
        { spotId: onta.id, orderNo: 2, transitMode: "bus", transitDurationMin: 40 },
      ],
    });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
