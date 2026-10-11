/**
 * #242 0c542f79 の続き（しおりえ(制作補助2)）: audit の指摘で、吉城園の本文の料金と受付時刻を外す
 *   「入園は無料で、受付は16時30分までです。」→「受付の時間は公式の案内で確かめましょう。」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-242b-0c542f79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0c542f79-2811-4a59-bfcb-34816ad72c3e";
const FROM = "入園は無料で、受付は16時30分までです。";
const TO = "受付の時間は公式の案内で確かめましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "吉城園" } });
  if (s.length !== 1) throw new Error(`吉城園 ${s.length}件`);
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
