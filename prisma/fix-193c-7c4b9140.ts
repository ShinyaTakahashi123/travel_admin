/**
 * #193 7c4b9140 の続き（しおりえ(制作補助2)）: 法務の確認で、説明文の「市内でいちばん古い西公園」を同じ文の中でぼかす
 *   「市内でいちばん古い西公園」→「市内でいちばん古いとされる西公園」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-193c-7c4b9140.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "7c4b9140-57ad-4526-b415-385423403358";
const COMMIT = process.argv.includes("--commit");
const FROM = "市内でいちばん古い西公園";
const TO = "市内でいちばん古いとされる西公園";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  const d = it.description ?? "";
  if (d.split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const next = d.replace(FROM, TO);
  console.log(next);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: next } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
