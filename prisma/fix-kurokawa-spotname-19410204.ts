/**
 * 黒川温泉(19410204)のスポット名の直し(2026-11-03)。
 * 川端通りを別スポットに分けたため、「黒川温泉（地蔵堂・川端通り）」→「黒川温泉」に
 * 直す(点は温泉街入口のバス停のため、地蔵堂も名前に入れない。企画運営の指示)。
 * 名前だけの直しで、点・時刻・滞在・区間・文は変えない。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const SPOT_ID = "11cf24be-7815-4aa8-8aad-ee04b7010b0c";

const NAME_OLD = "黒川温泉（地蔵堂・川端通り）";
const NAME_NEW = "黒川温泉";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
  if (spot.name !== NAME_OLD) throw new Error("スポット名の現在値が期待と不一致");

  console.log(`\n旧: ${NAME_OLD}`);
  console.log(`新: ${NAME_NEW}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: SPOT_ID }, data: { name: NAME_NEW } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
