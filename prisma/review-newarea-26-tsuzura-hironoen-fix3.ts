/**
 * #26の直し(自己点検)。前のスクリプトで、既存のスポット行を再利用して順番を
 * 組み直した際、移動データ(transitLeg)を見落としていた。
 * - 吉井歴史民俗資料館(今は1番目)に、もとの構成(弘農園→資料館、車15分)の
 *   古い移動データが残っていたため削除する
 * - つづら棚田(今は5番目)には移動データが無かった(もとは1番目で移動データ不要
 *   だったため)。弘農園(12:32+80=13:52)から15分で14:07着として新規に作る
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const STALE_LEG_ID = "7bb96157-fee0-4e18-8e9e-0bcd400c0aae";
const TSUZURA_SPOT_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";

async function main() {
  const leg = await prisma.spotTransitLeg.findUnique({ where: { id: STALE_LEG_ID } });
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_SPOT_ID }, include: { transitLegs: true } });
  if (!leg || !tsuzura) throw new Error("想定と違います");
  if (tsuzura.transitLegs.length !== 0) throw new Error("つづら棚田に既に移動データがあります(想定外)");

  console.log("[確認OK] 吉井歴史民俗資料館の古い移動データを削除");
  console.log("[確認OK] つづら棚田の移動データ(車15分)を新規作成");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spotTransitLeg.delete({ where: { id: STALE_LEG_ID } });
  await prisma.spotTransitLeg.create({ data: { spotId: TSUZURA_SPOT_ID, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
