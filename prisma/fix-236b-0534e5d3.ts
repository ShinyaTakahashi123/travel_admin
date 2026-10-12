/**
 * #236 0534e5d3 の和田家の本文の書き分け（しおりえ(制作補助2)、企画運営の指摘 10/11）
 * #8d2e4984 などほかの和田家の文と組み立てが似ていたので、ほかの5本（#b991287e・#8d2e4984・#1621a020・#8ba48819）が使っていない出典の話
 *   （館内の音声説明・二次元コードで館長の説明・生活スペースは非公開・2階からの眺め）で書き直す
 * 出典: 白川郷観光協会 https://shirakawa-go.gr.jp/active/13/
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-236b-0534e5d3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const WADA = "5512710b-7b02-42df-aa7c-d1fec8710819";
const COMMIT = process.argv.includes("--commit");
const MEMO =
  "2日目は路線バスと歩きでめぐります。高山濃飛バスセンターから朝のバスで約50分、白川郷で降りて歩いてすぐ。国の重要文化財に指定された大きな合掌造りの家で、館内では、家の歴史や合掌造りの仕組みを伝える音声の説明が流れ、二次元コードで館長の解説を聞けるコーナーもあります。今も家族が暮らす家なので、公開されていない生活の場には入らないようにしましょう。2階の窓から見下ろす雪の集落もおすすめです。冬は雪や凍った道で滑りやすいので、滑りにくい靴でゆっくり歩きましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: WADA } });
  if (!(s.memo ?? "").startsWith("2日目は路線バスと歩きでめぐります。")) throw new Error("本文が想定と違います");
  console.log(MEMO);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: WADA }, data: { memo: MEMO } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
