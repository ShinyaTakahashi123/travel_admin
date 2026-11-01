/**
 * 法務の指摘: 22c9a16cの説明文に宿の名前「新富良野プリンスホテル」が残っていた(6章)。
 * 組み直しで足した「青い池」「美瑛選果」も説明文に入っていなかったため、あわせて足す。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "22c9a16c-f753-481c-b2a1-e2c542feb897";

const OLD_DESC =
  "1本の木が丘に立つケンとメリーの木から、十勝岳を望む望岳台、轟音とともに流れ落ちる白ひげの滝、色とりどりの花が咲く四季彩の丘、新富良野プリンスホテルのニングルテラスまで。富良野・美瑛の丘の風景を1日で回るプランです。";
const NEW_DESC =
  "1本の木が丘に立つケンとメリーの木から、十勝岳を望む望岳台、轟音とともに流れ落ちる白ひげの滝、コバルトブルーの青い池、昼食をとる美瑛選果、色とりどりの花が咲く四季彩の丘、森の中にクラフト工房が並ぶニングルテラスまで。富良野・美瑛の丘の風景を1日で回るプランです。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description !== OLD_DESC) throw new Error("description現在値が期待と不一致");
  console.log(`旧: ${OLD_DESC}\n新: ${NEW_DESC}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
