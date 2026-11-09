/**
 * 企画運営の依頼: 成田(708a13d8)の題「定番」を外す。
 * 「成田山新勝寺の初詣、新年を寺で迎える定番プラン」→「…日帰りプラン」
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "708a13d8-bdd1-4525-9e63-88b12c57eedc";
const OLD_TITLE = "成田山新勝寺の初詣、新年を寺で迎える定番プラン";
const NEW_TITLE = "成田山新勝寺の初詣、新年を寺で迎える日帰りプラン";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.title !== OLD_TITLE) throw new Error("title現在値が期待と不一致");
  console.log(`旧: ${OLD_TITLE}\n新: ${NEW_TITLE}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: NEW_TITLE } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
