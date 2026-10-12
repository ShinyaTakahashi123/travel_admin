/**
 * #369の続き。法務の指摘3点に対応(記録ba175c5)。
 *
 * ① 總持寺祖院: 令和6年10月18日は文化審議会の答申の日で、指定そのものは
 *    そのあと(官報告示)のため、「令和6年(2024)10月には…指定されました」
 *    から日付を外し、「…指定されています」という現在の事実の書き方に修正。
 * ② 輪島塗会館: 「2階の展示室は休止していますが、1階は営業を続けています」
 *    は出典を確かめられなかったため削除。「開館の状況は公式の案内で
 *    確かめましょう」は残す。
 * ③ 輪島塗会館の座標: 建物way中心の丸めた値(37.3942,136.9001→前回37.394086,
 *    136.900154に修正済みだったが、それもOSMに施設の点がなく丸めた値)から、
 *    建物前のバス停「輪島塗会館」(n5591930221、37.393896,136.901163、
 *    推定)に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-369e-ceb2a9a1.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "c3e04cfa-0484-4fae-b8cd-27ae788efaff";

async function main() {
  const sojiji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "總持寺祖院" } });
  const wajimanuri = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "輪島塗会館" } });

  const sojijiOld = "令和6年(2024)10月には、法堂や山門など16棟の建物が、国の重要文化財に指定されました。";
  const sojijiNew = "法堂や山門など16棟の建物が、国の重要文化財に指定されています。";

  const nuriOld =
    "1階の売店では、椀や箸、皿など、職人の手による輪島塗の品々を見て回ることができます。令和6年(2024)の能登半島地震の影響で、2階の展示室は休止していますが、1階は営業を続けています。開館の状況は、出かける前に公式の案内で確かめましょう。";
  const nuriNew =
    "1階の売店では、椀や箸、皿など、職人の手による輪島塗の品々を見て回ることができます。開館の状況は、出かける前に公式の案内で確かめましょう。";

  if (wajimanuri.lat?.toString() === "37.393896") {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: sojiji.id },
    data: { memo: sojiji.memo?.includes(sojijiOld) ? sojiji.memo.replace(sojijiOld, sojijiNew) : sojiji.memo },
  });

  await prisma.spot.update({
    where: { id: wajimanuri.id },
    data: {
      lat: 37.393896,
      lng: 136.901163,
      memo: wajimanuri.memo?.includes(nuriOld) ? wajimanuri.memo.replace(nuriOld, nuriNew) : wajimanuri.memo,
    },
  });

  console.log("#369続き: 總持寺祖院の指定の書き方、輪島塗会館の出典不明な一文削除・座標(推定)を修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
