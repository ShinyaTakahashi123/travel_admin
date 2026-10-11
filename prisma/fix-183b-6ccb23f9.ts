/**
 * #183 6ccb23f9 の続き（しおりえ(制作補助2)）: 企画運営の確認（2026-10-11）で、将棋資料館の「約9割以上」は「約」と「以上」が重なるので「9割以上」にする（出典の天童市「全国の約９割以上」は言い回しが重なるので、「以上」のほうに合わせる）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-183b-6ccb23f9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ccb23f9-c0e0-445c-a1fa-12d985c20efd";
const FROM = "全国の駒の約9割以上がここでつくられるといわれます。";
const TO = "全国の駒の9割以上がここでつくられるといわれます。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "天童市将棋資料館" } });
  if (s.length !== 1) throw new Error(`天童市将棋資料館 ${s.length}件`);
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
