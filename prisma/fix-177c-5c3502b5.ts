/**
 * #177 5c3502b5 の続き（しおりえ(制作補助2)）: fix-177b で移動の文に「785段」を入れたので、金刀比羅宮の本文の2つ目の「御本宮までは785段の石段が続き、」を外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-177c-5c3502b5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5c3502b5-0318-4f0d-bb31-797899970ef5";
const FROM = "御本宮までは785段の石段が続き、その途中には大門や";
const TO = "石段の途中には大門や";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "金刀比羅宮" } });
  if (s.length !== 1) throw new Error(`金刀比羅宮 ${s.length}件`);
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
