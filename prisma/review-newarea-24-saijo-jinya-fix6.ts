/**
 * #24の直し(任意の親切さの追加)。企画運営の提案(2026-10-13)に対応。
 * 山の中腹にあるため、帰りのタクシーを呼んでおくと安心という一言を加える。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const koko = await prisma.spot.findFirst({ where: { name: "西条市考古歴史館" } });
  if (!koko?.memo) throw new Error("想定と違います");
  const newMemo = koko.memo.replace(
    "帰りもタクシーを利用しましょう。",
    "帰りのタクシーは、あらかじめ呼んでおくと安心です。"
  );
  if (newMemo === koko.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 帰りのタクシーの一言を直す");
  console.log("新メモ:", newMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: koko.id }, data: { memo: newMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
