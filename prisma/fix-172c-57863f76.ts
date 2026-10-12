/**
 * #172 57863f76 の続き（しおりえ(制作補助2)）: 企画運営の指摘で、広浦公園の汽水の話が次の涸沼自然公園と続けて重なるので、広浦公園からは外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-172c-57863f76.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "57863f76-862a-4186-a8b0-8f2d93ee54d9";
const FROM = "前の広浦港は、海水と淡水がまじる涸沼ならではのさまざまな魚が釣れる場所です。";
const TO = "前の広浦港は、さまざまな魚が釣れる場所です。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "広浦公園" } });
  if (s.length !== 1) throw new Error(`広浦公園 ${s.length}件`);
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
