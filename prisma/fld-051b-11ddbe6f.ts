/**
 * #51 11ddbe6f 天城展望台の書き出しの直し（しおりえ(制作補助2)、法務 10/30。1日目の最後は阿嘉ビーチなので「ニシハマビーチから」を外す。文だけ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-051b-11ddbe6f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const AMA = "56ff8f8a-ef5a-42e2-bef3-479399f4b933";
const FROM = "ニシハマビーチから一夜明け、今日は";
const TO = "一夜明け、今日は";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: AMA }, include: { day: { select: { itineraryId: true } } } });
  if (!s.day.itineraryId.startsWith("11ddbe6f") || (s.memo ?? "").split(FROM).length !== 2) throw new Error("いまの文が想定と違います");
  console.log(`${s.name}: ${FROM} → ${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: AMA }, data: { memo: s.memo!.replace(FROM, TO) } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
