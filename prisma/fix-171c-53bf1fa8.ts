/**
 * #171 53bf1fa8 の続き（しおりえ(制作補助2)）: 企画運営の指摘（2026-10-11、38dec57e の文と約70%似ている）で、メリケンパークの BE KOBE の文の組み立てを変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-171c-53bf1fa8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "53bf1fa8-d837-4f00-84e2-f69b487fda25";
const FROM = "阪神・淡路大震災から20年をきっかけに生まれた、「神戸の魅力は人である」という思いを込めた言葉です。";
const TO = "町を支えてきた人たちこそが神戸の誇りだという思いを表す言葉で、阪神・淡路大震災から20年の節目に生まれました。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "メリケンパーク" } });
  if (s.length !== 1) throw new Error(`メリケンパーク ${s.length}件`);
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
