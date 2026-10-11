/**
 * #182 6ac78863 の続き（しおりえ(制作補助2)）: 企画運営の確認（2026-10-11）で、大正池の「『梓湖』とも呼ばれていたようです」を「呼ばれていたとされます」にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-182b-6ac78863.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ac78863-2332-442e-a55e-a594941d8df1";
const FROM = "「梓湖」とも呼ばれていたようです。";
const TO = "「梓湖」とも呼ばれていたとされます。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "大正池" } });
  if (s.length !== 1) throw new Error(`大正池 ${s.length}件`);
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
