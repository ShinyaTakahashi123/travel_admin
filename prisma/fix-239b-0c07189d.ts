/**
 * #239 0c07189d の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 14:21、記録 b6af89a）で、飫肥の町並みに暮らしの一文がなかったので、
 *   小村記念館の「（近くの駐車場に車を停めて歩きます）。」のあとに暮らしの一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-239b-0c07189d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0c07189d-03ef-438f-9d27-1cc1a01a262e";
const FROM = "（近くの駐車場に車を停めて歩きます）。";
const TO = FROM + "飫肥の町並みには今も人が暮らしているので、静かに歩きましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "小村記念館" } });
  if (s.length !== 1) throw new Error(`小村記念館 ${s.length}件`);
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
