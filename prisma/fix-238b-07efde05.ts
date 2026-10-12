/**
 * #238 07efde05 の続き（しおりえ(制作補助2)）: 指月殿の本文で「静かに」の一文が2つ続いていた（法務の参考 2026-10-11 14:07）ので、
 *   「亡くなった人をしのぶ場所なので、静かに見学しましょう。」を「亡くなった人をしのぶ場所です。」にして、続く拝む一文だけにする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-238b-07efde05.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "07efde05-b25f-4251-a8e3-c12e4918bfb1";
const FROM = "亡くなった人をしのぶ場所なので、静かに見学しましょう。";
const TO = "亡くなった人をしのぶ場所です。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "指月殿" } });
  if (s.length !== 1) throw new Error(`指月殿 ${s.length}件`);
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
