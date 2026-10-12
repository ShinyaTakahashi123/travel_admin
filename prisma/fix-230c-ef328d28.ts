/**
 * #230 ef328d28 の言い方の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * 登録有形文化財は「指定」ではなく「登録」なので、「国の登録有形文化財に指定されています」→「国の登録有形文化財に登録されています」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-230c-ef328d28.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ef328d28-b822-4bfd-851d-1478a88bf499";
const COMMIT = process.argv.includes("--commit");
const F = "国の登録有形文化財に指定されています。";
const T = "国の登録有形文化財に登録されています。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "千葉市民ギャラリー・いなげ（旧神谷傳兵衛稲毛別荘）" } });
  if (spots.length !== 1 || !(spots[0].memo ?? "").includes(F)) throw new Error("構成が想定と違います");
  const memo = spots[0].memo!.replace(F, T);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: spots[0].id }, data: { memo } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
