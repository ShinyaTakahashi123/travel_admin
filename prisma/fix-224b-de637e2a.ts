/**
 * #224 de637e2a の安全の一文の追加（しおりえ(制作補助2)、法務の指摘 10/11）
 * 弥三郎岳の頂上は切り立った岩場なので、足元に十分気をつける一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-224b-de637e2a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ROPEWAY = "f85207df-0568-479b-a5d4-6e6f1202bd60";
const COMMIT = process.argv.includes("--commit");
const FROM = "弥三郎岳への道は山道なので、歩きやすい靴で出かけましょう。";
const TO = "弥三郎岳への道は山道なので、歩きやすい靴で出かけましょう。頂上は岩場で、まわりが切り立っているので、足元に十分気をつけましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: ROPEWAY } });
  if (!(s.memo ?? "").includes(FROM) || (s.memo ?? "").includes("切り立って")) throw new Error("本文が想定と違います");
  const memo = s.memo!.replace(FROM, TO);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: ROPEWAY }, data: { memo } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
