/**
 * #240 0c237404 の続き（しおりえ(制作補助2)）: prayer-check の指摘で、田町の武家屋敷通りにある西宮家に暮らしの一文がなかったので、
 *   西宮家の「（近くの駐車場に停めて歩きます）。」のあとに暮らしの一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-240b-0c237404.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0c237404-68b3-458c-bd13-edf7f6a0c6f4";
const FROM = "（近くの駐車場に停めて歩きます）。";
const TO = FROM + "田町の武家屋敷通りには今も人が暮らす家もあるので、静かに歩きましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "西宮家" } });
  if (s.length !== 1) throw new Error(`西宮家 ${s.length}件`);
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
