/**
 * seed-local-03-uchiko.ts の登録直後に行う、季節(seasons)と区間の直し。
 * handmade-genには季節を付ける仕組みがなく、1スポットに1区間しか持てないため、
 * 別スクリプトで同じ確認の中で行う(itinerary-rules.md433-434行、日田と同じ形)。
 *
 * ①季節: タイトルの主な題材(史跡・町並み・屋根付き橋)は特定の季節のものではないため、
 *   季節を問わない内容として春夏秋冬の4つを付ける。
 * ②区間: 「道の駅内子フレッシュパークからり→田丸橋」は、実際は「歩いて内子駅まで戻る
 *   (OSRM徒歩25分)→駅のそばでレンタカーの手続き(15分)→車で田丸橋まで(OSRM13分)」の
 *   3区間だが、登録時は1区間(other 53分)だったため、3区間に分ける(企画運営の指摘
 *   2026-11-02、data の中身を確かめられる形にする)。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID_TITLE = "木蝋の商家町とレトロな屋根付き橋をめぐる内子日帰りプラン";
const SEASONS = ["spring", "summer", "autumn", "winter"];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findFirstOrThrow({ where: { title: ITIN_ID_TITLE } });
  console.log(`対象: ${itin.title} (${itin.id})`);
  console.log(`現在のseasons: ${JSON.stringify(itin.seasons)}`);
  console.log(`新しいseasons: ${JSON.stringify(SEASONS)}(季節を問わない内容のため4つ)`);

  const tamaru = await prisma.spot.findFirstOrThrow({
    where: { name: "田丸橋", day: { itineraryId: itin.id } },
    include: { transitLegs: true },
  });
  console.log(
    `\n[田丸橋] 現在の区間: ${JSON.stringify(tamaru.transitLegs.map((l) => ({ mode: l.transitMode, min: l.transitDurationMin })))}`
  );
  console.log(`新しい区間: walk25分(内子駅まで) → other15分(手続き) → car13分(田丸橋まで)`);
  if (
    tamaru.transitLegs.length !== 1 ||
    tamaru.transitLegs[0].transitMode !== "other" ||
    tamaru.transitLegs[0].transitDurationMin !== 53
  ) {
    throw new Error("田丸橋: 区間の現在値が期待と不一致");
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itin.id }, data: { seasons: SEASONS } });
    await tx.spotTransitLeg.deleteMany({ where: { spotId: tamaru.id } });
    await tx.spotTransitLeg.createMany({
      data: [
        { spotId: tamaru.id, orderNo: 1, transitMode: "walk", transitDurationMin: 25 },
        { spotId: tamaru.id, orderNo: 2, transitMode: "other", transitDurationMin: 15 },
        { spotId: tamaru.id, orderNo: 3, transitMode: "car", transitDurationMin: 13 },
      ],
    });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
