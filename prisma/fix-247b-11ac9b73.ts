/**
 * #247 11ac9b73 の続き（しおりえ(制作補助2)）: prayer-check の指摘で、ホタル館 富屋食堂の慰霊の一文を、平和会館と同じ「静かに、敬意をもって」の形にそろえる
 *   「ここも亡くなった方々をしのぶ場所ですので、静かに見学しましょう。」→「…静かに、敬意をもって見学しましょう。」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-247b-11ac9b73.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "11ac9b73-e139-4423-a4a0-5b32958f042d";
const FROM = "ここも亡くなった方々をしのぶ場所ですので、静かに見学しましょう。";
const TO = "ここも亡くなった方々をしのぶ場所ですので、静かに、敬意をもって見学しましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "ホタル館 富屋食堂" } });
  if (s.length !== 1) throw new Error(`ホタル館 ${s.length}件`);
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
