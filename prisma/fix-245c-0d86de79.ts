/**
 * #245 0d86de79 の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 14:49、記録 4df03ae）で、ブセナ海中公園のグラス底ボートに船の一文がなかったので、
 *   「海の上からも魚やサンゴを眺められます。」のあとに「ボートに乗るときは、係の人の案内に従いましょう。」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-245c-0d86de79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0d86de79-d869-4906-9bbd-55f534a66241";
const FROM = "海の上からも魚やサンゴを眺められます。";
const TO = FROM + "ボートに乗るときは、係の人の案内に従いましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "ブセナ海中公園" } });
  if (s.length !== 1) throw new Error(`ブセナ海中公園 ${s.length}件`);
  const memo = s[0].memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const neu = memo.replace(FROM, TO);
  console.log(neu);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: s[0].id }, data: { memo: neu } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
