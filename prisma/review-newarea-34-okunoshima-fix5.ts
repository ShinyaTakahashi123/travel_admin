/**
 * #34の直し(自己点検)。説明文に大久野島ビジターセンターが反映されていなかった
 * ため追加。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "281700ca-4efe-4466-bccc-c8cebe1ee00e";

const OLD_DESC =
  "竹原市忠海港からフェリーで渡る大久野島は、かつて旧陸軍の毒ガス製造の拠点だった歴史と、野生のウサギが暮らす自然があわせて残る島です。毒ガス資料館・発電所跡・長浦毒ガス貯蔵庫跡・北部砲台跡でその歴史を伝え、灯台からの眺めや休暇村大久野島周辺で瀬戸内の自然を楽しむ日帰りプランです。フェリーの時刻は季節や曜日により変わるので、お出かけ前に公式の案内で確かめ、余裕を持った行程にしましょう。";

const NEW_DESC =
  "竹原市忠海港からフェリーで渡る大久野島は、かつて旧陸軍の毒ガス製造の拠点だった歴史と、野生のウサギが暮らす自然があわせて残る島です。毒ガス資料館・発電所跡・長浦毒ガス貯蔵庫跡・北部砲台跡でその歴史を伝え、大久野島ビジターセンターや灯台からの眺め、休暇村大久野島周辺で瀬戸内の自然を楽しむ日帰りプランです。フェリーの時刻は季節や曜日により変わるので、お出かけ前に公式の案内で確かめ、余裕を持った行程にしましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("想定と違います");

  console.log("[確認OK] 説明文に大久野島ビジターセンターを追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
