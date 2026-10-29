/**
 * #143 83518f0d の続き（しおりえ(制作補助2)、2026-10-30。法務の指摘）: 狸小路の泊まりの一文を決まりの形に
 *   「今夜は札幌に泊まります。」→「この夜は、札幌の宿に泊まりましょう。」
 * 時刻・座標は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-143b-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const WADA = "099f2144-1577-4c84-b1b7-d965850373bc";
const FROM = "今夜は札幌に泊まります。";
const TO = "この夜は、札幌の宿に泊まりましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: WADA } });
  if (s.name !== "狸小路商店街") throw new Error(`名前が違います（${s.name}）`);
  const memo = s.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("置き換え元が見つかりません");
  const next = memo.replace(FROM, TO);
  console.log(`${s.name}\n  前: ${memo}\n  後: ${next}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: WADA }, data: { memo: next } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
