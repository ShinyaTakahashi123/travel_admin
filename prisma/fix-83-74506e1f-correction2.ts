/**
 * #83の訂正その2。法務の指摘で、4けたに丸めた座標2点をOSMの値に直す(丸めの直しのため、
 * 法務のOKのみで書き込み。前後の移動の分数は数mの違いのため変更なし)。
 * - 熊野本宮大社: 33.8404,135.7736 → OSM way797748245(Nominatim 33.8403512,135.7736333)
 * - 熊野速玉大社: 33.7321,135.9836 → OSM way211578006(Nominatim 33.7322978,135.9836823)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-83-74506e1f-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-83-74506e1f-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const HONGU_ID = "4f38bc3a-ff17-4e52-8933-d294d3ae4ffd";
const HAYATAMA_ID = "f3c84373-2ba7-4a9f-ad50-a25ff3009727";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #83 訂正その2: 座標の丸めを直す ===");
  console.log("熊野本宮大社: 33.8404,135.7736 → 33.8403512,135.7736333");
  console.log("熊野速玉大社: 33.7321,135.9836 → 33.7322978,135.9836823");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: HONGU_ID }, data: { lat: 33.8403512, lng: 135.7736333 } }),
    prisma.spot.update({ where: { id: HAYATAMA_ID }, data: { lat: 33.7322978, lng: 135.9836823 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
