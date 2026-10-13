/**
 * #34の直し(自己点検)。説明文に新スポットを反映し、「毒ガス資料館・発電所跡で
 * 史実を学び…楽しむ」と、歴史を学ぶことと自然を楽しむことが一文でつながって
 * いた言い回しを、法務の方針(慰霊の場所は静かに・敬意をもって)に合わせて
 * 分けて書き直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "281700ca-4efe-4466-bccc-c8cebe1ee00e";

const OLD_DESC =
  "竹原市忠海港からフェリーで渡る大久野島は、かつて旧陸軍の毒ガス製造の拠点だった歴史と、野生のウサギが暮らす自然があわせて残る島です。毒ガス資料館・発電所跡で史実を学び、灯台からの眺めや休暇村大久野島周辺の散策を楽しむ日帰りプランです。フェリーの時刻は季節や曜日により変わるので、お出かけ前に公式の案内で確かめ、余裕を持った行程にしましょう。";

const NEW_DESC =
  "竹原市忠海港からフェリーで渡る大久野島は、かつて旧陸軍の毒ガス製造の拠点だった歴史と、野生のウサギが暮らす自然があわせて残る島です。毒ガス資料館・発電所跡・長浦毒ガス貯蔵庫跡・北部砲台跡でその歴史を伝え、灯台からの眺めや休暇村大久野島周辺で瀬戸内の自然を楽しむ日帰りプランです。フェリーの時刻は季節や曜日により変わるので、お出かけ前に公式の案内で確かめ、余裕を持った行程にしましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("想定と違います");

  console.log("[確認OK] 説明文に長浦毒ガス貯蔵庫跡・北部砲台跡を追加し、歴史と自然の言い回しを分ける");
  console.log("新説明文:", NEW_DESC);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
