/**
 * #387 ea38491a の続き（しおりえ(制作補助2)）: audit の指摘（加藤神社→城彩苑 0.4km に徒歩20分は長すぎ）で、徒歩15分にし、加藤神社の滞在を40分（10:35〜11:15）にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-387d-ea38491a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const KATO = "fda6eb67-0148-4186-b709-ab1933e0196f";
const JOSAIEN = "b54826c7-ed54-487c-9409-0403cab593a3";
const FROM = "加藤神社から城の南側へ歩いて約20分、";
const TO = "加藤神社から城の南側へ歩いて約15分、";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const k = await prisma.spot.findUniqueOrThrow({ where: { id: KATO } });
  const j = await prisma.spot.findUniqueOrThrow({ where: { id: JOSAIEN } });
  if (k.stayDurationMin !== 35 || (j.memo ?? "").split(FROM).length !== 2) throw new Error("想定と違います");
  const memo = (j.memo ?? "").replace(FROM, TO);
  console.log(`加藤神社 滞在35→40分 / 城彩苑 徒歩20→15分\n${memo}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: KATO }, data: { stayDurationMin: 40 } }),
    prisma.spot.update({ where: { id: JOSAIEN }, data: { memo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] } } }),
  ]);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
