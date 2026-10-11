/**
 * #174 5b2a965f の続き（しおりえ(制作補助2)）: 監査の「言い切り?」の指摘で、旧三上家住宅の庭の「最も美しく見えるように」を、出典の言い方（奥座敷からの眺めが良く見えるように）に合わせる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-174b-5b2a965f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5b2a965f-d418-4fb0-93b5-b715252e8740";
const FROM = "奥座敷から眺めたときに最も美しく見えるようにつくられています。";
const TO = "奥座敷からの眺めがよくなるようにつくられています。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "旧三上家住宅" } });
  if (s.length !== 1) throw new Error(`旧三上家住宅 ${s.length}件`);
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
