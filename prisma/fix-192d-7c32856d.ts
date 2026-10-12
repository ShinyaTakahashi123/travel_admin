/**
 * #192 7c32856d の続き（しおりえ(制作補助2)）: 法務の再確認で、説明文に残っていた商業施設の名前「祭の湯」を外す
 *   「昼食は西武秩父駅前の祭の湯で。」→「昼食は西武秩父駅前で。」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-192d-7c32856d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "7c32856d-87b9-465d-bd0c-8c3747032d79";
const COMMIT = process.argv.includes("--commit");
const FROM = "昼食は西武秩父駅前の祭の湯で。";
const TO = "昼食は西武秩父駅前で。";

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
