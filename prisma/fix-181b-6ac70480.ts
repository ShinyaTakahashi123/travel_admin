/**
 * #181 6ac70480 の続き（しおりえ(制作補助2)）: 監査の「言い切り?」で、杉岡華邨書道美術館の「第一人者」「初めて」を同じ文の中でぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-181b-6ac70480.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ac70480-f655-419c-a820-8a2a46acbfd5";
const FROM = "かな書の第一人者で、かな書の分野で初めて文化勲章を受けた書家・杉岡華邨（1913〜2012）の作品を伝えるために開かれた、書道専門の美術館です。";
const TO = "かな書の第一人者とされ、かな書の分野で初めて文化勲章を受けたといわれる書家・杉岡華邨（1913〜2012）の作品を伝えるために開かれた、書道専門の美術館です。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "奈良市杉岡華邨書道美術館" } });
  if (s.length !== 1) throw new Error(`奈良市杉岡華邨書道美術館 ${s.length}件`);
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
