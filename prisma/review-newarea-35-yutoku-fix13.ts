/**
 * #35の直し(企画運営指摘、2026-10-13)。肥前浜宿酒蔵通りが100分になったのに
 * 名前が「（立ち寄り）」のままで、メモも通りを歩くだけの内容だったため、
 * (1)名前から「（立ち寄り）」を外し、(2)100分過ごす中身として、肥前浜宿が
 * 「浜中町八本木宿」(酒造業中心の醸造町)と「浜庄津町浜金屋町」(川港として
 * 栄えた在郷町、茅葺町家が残る)の2つの重要伝統的建造物群保存地区からなることを
 * 一文加える(出典: https://online.bunka.go.jp/heritages/region/41/41207
 * 文化庁の文化遺産オンライン。酒蔵の会社名は書かない)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const HAMASHUKU_SPOT_ID = "2530e81b-999d-4740-a47d-71053e4705a6";

const NEW_NAME = "肥前浜宿酒蔵通り";

const NEW_MEMO =
  "浜三ツ角でバスを降りたら、少し歩いて向かいます。佐賀県鹿島市浜町にある、国の重要伝統的建造物群保存地区です。酒蔵が軒を連ねる「浜中町八本木宿」と、川港として栄え茅葺きの町家が残る「浜庄津町浜金屋町」の2つの地区があり、合わせて肥前浜宿と呼ばれています。どちらも歩いてまわれる距離なので、白壁の酒蔵や昔ながらの町家の通りを、のんびりと歩いてみましょう。今も人が暮らす町並みですので、家の敷地に入らず、静かに散策しましょう。見学を終えたら、すぐ近くのJR肥前浜駅から帰路につきましょう。";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: HAMASHUKU_SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 名前:", spot.name, "→", NEW_NAME);
  console.log("[確認OK] メモに2つの地区の内容を追加(出典: online.bunka.go.jp)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: HAMASHUKU_SPOT_ID }, data: { name: NEW_NAME, memo: NEW_MEMO } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
