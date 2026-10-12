/**
 * #387 ea38491a（しおりえ(制作補助2)）: 城彩苑の本文に「湧々座もあり」とあるが、熊本城ミュージアム わくわく座は令和8年熊本地震のため臨時休館中
 *   （城彩苑公式 https://www.sakuranobaba-johsaien.jp/waku-index/ 9月11日のお知らせ・熊本城公式 https://castle.kumamoto-guide.jp/news/detail/1459 9月18日時点）ので、休館の一文に直す（企画運営の依頼 2026-10-11）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-387b-ea38491a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ea38491a-1d85-432a-b2ed-6687d493e6ef";
const FROM = "熊本城の歴史を映像や展示で楽しめる「湧々座」もあり、午前中に歩いた城の見どころをふり返ることができます。";
const TO = "熊本城の歴史を映像や展示で紹介する「わくわく座」は、地震のため休館しているので、再開は公式の案内で確かめましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "桜の馬場 城彩苑" } });
  if (s.length !== 1) throw new Error(`城彩苑 ${s.length}件`);
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
