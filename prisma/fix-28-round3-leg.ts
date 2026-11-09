/**
 * #28 三峯神社の霧海と気運(15185f58) ラウンド3: 書き込み漏れの是正
 *
 * fix-28-chichibu.tsの書き込みで、祭の湯(西武秩父駅前温泉 祭の湯)のtransitLegsを
 * 更新し忘れ、羊山公園→祭の湯の区間がwalk/12のまま(本来walk/18、座標直しに伴う再計算
 * 済みの値)で本番に反映されてしまった。memo本文はすでに「歩いておよそ18分」に直して
 * あり、visitTime(15:17)もwalk/18の前提で計算済み。itinerary-auditで「期待15:11
 * 実際15:17」のずれとして発覚。legだけを是正する(時刻・滞在・文はすでに正しい)。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const MATSURI_NO_YU = "ec2bc30c-a254-43f2-940d-1c9df9817d77";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: MATSURI_NO_YU }, include: { transitLegs: true } });
  if (!spot) throw new Error("祭の湯が見つかりません");
  if (!spot.transitLegs.length || spot.transitLegs[0].transitMode !== "walk" || spot.transitLegs[0].transitDurationMin !== 12) {
    throw new Error("祭の湯: legの現在値が期待(walk/12)と不一致");
  }

  console.log("前提の確認OK(現在walk/12)。\n");
  console.log("[leg是正] 羊山公園→祭の湯: walk/12 → walk/18 に是正(書き込み漏れの修正、時刻・滞在・文は変更なし)");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.spotTransitLeg.updateMany({
    where: { spotId: MATSURI_NO_YU },
    data: { transitDurationMin: 18 },
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
