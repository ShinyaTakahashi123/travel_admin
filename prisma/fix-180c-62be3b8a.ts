/**
 * #180 62be3b8a の続き（しおりえ(制作補助2)）: 企画運営の確認（2026-10-11）で、中宮祠の「静かにお参りしましょう」が拝む一文と続けて2回出るので、前のほうを景色の文にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-180c-62be3b8a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "62be3b8a-f393-4595-b524-bf4e5fc2e9ed";
const FROM = "湖を前に、男体山を背にした景色の中で、静かにお参りしましょう。";
const TO = "境内からは、湖を前に、男体山を背にした景色が広がります。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "日光二荒山神社中宮祠" } });
  if (s.length !== 1) throw new Error(`日光二荒山神社中宮祠 ${s.length}件`);
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
