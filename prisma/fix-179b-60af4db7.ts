/**
 * #179 60af4db7 の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 16:52、記録 000ae5f）で、令和8年熊本地震のあとの一文に、被災地の決まり（#237 と同じ）の「復旧に取り組む地域の人たちの迷惑にならないように」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-179b-60af4db7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "60af4db7-ce32-4458-839a-9545221488a7";
const FROM = "出かける前に、道路や施設の最新の情報を確かめましょう。";
const TO = "出かける前に、道路や施設の最新の情報を確かめ、復旧に取り組む地域の人たちの迷惑にならないようにしましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "長者原（タデ原湿原）" } });
  if (s.length !== 1) throw new Error(`長者原（タデ原湿原） ${s.length}件`);
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
