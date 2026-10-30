/**
 * #89 会津・磐梯3泊4日の訂正その3。法務の本番確認で見つかった残り2点。
 *
 * - 飯盛山: node6763912254「白虎隊士の墓」(information=board)から、すぐそばの
 *   node2483954902「嗚呼忠烈白虎隊の碑」(historic=memorial、37.5039487,139.9543931)に
 *   直す。墓のまわりの一文を、祈りの形(「お参りください」)から、墓・慰霊の形
 *   (「…のまわりでは、静かに過ごしましょう。」)に直す。
 * - 野口英世青春館: 法務の前回の指摘でバス停(別の物の点、約5m)に直したが、GSIで住所
 *   (福島県会津若松市中町4番18号)を調べたところ、今の値(37.497643,139.927155)と完全に
 *   一致する地理院の番地の点だったため、もとの値に戻す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-89-c3b9522c-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-89-c3b9522c-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const IIMORIYAMA_ID = "f954ae6a-464b-4877-8815-bca2844bfbb1";
const SEISHUNKAN_ID = "9f5d2931-e121-42d8-8a87-cc8290b098c4";

const IIMORIYAMA_FIND = "今も慰霊が続く場所ですので、静かに、敬意をもってお参りください。";
const IIMORIYAMA_REPLACE = "墓所のまわりでは、静かに過ごしましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const iimoriyama = await prisma.spot.findFirstOrThrow({ where: { id: IIMORIYAMA_ID } });
  if (!iimoriyama.memo?.includes(IIMORIYAMA_FIND)) {
    console.log("[想定と違います] 飯盛山に対象の文が見つかりません。処理を中止します。");
    return;
  }
  const newIimoriyamaMemo = iimoriyama.memo.replace(IIMORIYAMA_FIND, IIMORIYAMA_REPLACE);

  console.log("=== #89 訂正その3 ===\n");
  console.log("飯盛山: 座標37.5039487,139.9543931(嗚呼忠烈白虎隊の碑)");
  console.log(newIimoriyamaMemo);
  console.log("\n野口英世青春館: 座標37.497643,139.927155に戻す(GSIの住所の点と完全一致)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: IIMORIYAMA_ID }, data: { lat: 37.5039487, lng: 139.9543931, memo: newIimoriyamaMemo } }),
    prisma.spot.update({ where: { id: SEISHUNKAN_ID }, data: { lat: 37.497643, lng: 139.927155 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
