/**
 * b6c6744a 金森赤レンガ倉庫のメモの「おすすめ」を直す（しおりえ(制作補助2)、法務 10/30 の指摘。文だけの直し）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-048e-b6c6744a-wording.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const KANE = "e539b04e-1d8f-43c9-936c-af3433f9b8ca";
const FROM = "ライトアップされた夜の散策にもおすすめのスポットです";
const TO = "ライトアップされた夜の散策にも向いています";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: KANE }, include: { day: { select: { itineraryId: true } } } });
  if (!s.day.itineraryId.startsWith("b6c6744a") || (s.memo ?? "").split(FROM).length !== 2) throw new Error("いまの文が想定と違います");
  console.log(`${s.name}: ${FROM} → ${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: KANE }, data: { memo: s.memo!.replace(FROM, TO) } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
