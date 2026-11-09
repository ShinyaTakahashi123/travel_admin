/**
 * 直し漏れ、218ccf2d（のんほいパーク）の遊園地ゾーンの点。
 *
 * fix-nonhoi-restructure.ts で座標を書き込む対象から rose園地ゾーンが漏れていた
 * (memo・時刻・滞在・区間は正しく直っていたが、lat/lngだけ古い丸めた値のまま本番に残って
 * いた。法務の本番確認、2026-11-02)。区間の分(東門→遊園地4分・遊園地→本陣27分)は、
 * 正しい点(34.7196778,137.4353191、tourism=theme_park way1013611750)で測った値のため、
 * 座標だけを直せばよい。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "218ccf2d-4a04-4996-a6e4-c96435a0e455";
const AMU = "のんほいパーク（遊園地ゾーン）";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const amu = await prisma.spot.findFirstOrThrow({ where: { name: AMU, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(amu.lat) - 34.723) > 1e-4 || Math.abs(Number(amu.lng) - 137.4305) > 1e-4) {
    throw new Error(`遊園地ゾーン: 座標現在値が期待と不一致(現在 ${amu.lat},${amu.lng})`);
  }

  console.log(`遊園地ゾーン: 座標 ${amu.lat},${amu.lng} → 34.7196778,137.4353191(それ以外は変更なし)`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: amu.id }, data: { lat: 34.7196778, lng: 137.4353191 } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
