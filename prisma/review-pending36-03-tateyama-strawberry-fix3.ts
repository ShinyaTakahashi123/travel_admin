/**
 * #3の直し直しその2。企画運営の指摘(2026-10-13)に対応。出典より強い言い方になって
 * いた2か所をぼかす。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const CASTLE_SPOT_ID = "a7868fe3-196b-4d4a-b131-40334edc93d0";

async function main() {
  const castle = await prisma.spot.findUnique({ where: { id: CASTLE_SPOT_ID } });
  if (!castle || !castle.memo) throw new Error("想定と違います");
  const newMemo = castle.memo
    .replace("天守はなかったというのが定説です。", "天守はなかったと考えられています。")
    .replace("愛知県の犬山城を手本に昭和57年(1982)に建てられた模擬天守です。", "愛知県の犬山城を手本にしたとされる、昭和57年(1982)に建てられた模擬天守です。");
  if (newMemo === castle.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 「定説」→「考えられています」、「手本に…建てられた」→「手本にしたとされる…建てられた」");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: CASTLE_SPOT_ID }, data: { memo: newMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
