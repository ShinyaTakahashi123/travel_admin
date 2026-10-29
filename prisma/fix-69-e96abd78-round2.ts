/**
 * #69(小樽・積丹・余市2泊3日、e96abd78)、法務が本番確認で見つけた
 * 小樽天狗山の座標を直す(fix-69-e96abd78.tsのあとの2回目の直し)。
 *
 * 小樽天狗山 43.171959,140.972103: どのOSMの点にも当たっておらず、
 * いちばん近いのはロープウェイの山頂駅(6m離れ)だった。
 * node6057324225「天狗山ロープウェイ山頂駅」(aerialway=station)の
 * 43.1719793/140.9721664に合わせる。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-69-e96abd78-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-69-e96abd78-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TENGU_ID = "6000e345-e3a3-41cc-a356-a4d4f3f9c324"; // 小樽天狗山

async function main() {
  const commit = process.argv.includes("--commit");
  const tengu = await prisma.spot.findFirstOrThrow({ where: { id: TENGU_ID } });

  console.log(`[小樽天狗山] (id=${tengu.id})`);
  console.log("  旧lat/lng:", tengu.lat, tengu.lng, " → 新lat/lng: 43.1719793 / 140.9721664 (OSM node6057324225「天狗山ロープウェイ山頂駅」)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: TENGU_ID }, data: { lat: 43.1719793, lng: 140.9721664 } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
