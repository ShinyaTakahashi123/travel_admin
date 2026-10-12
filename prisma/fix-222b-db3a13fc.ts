/**
 * #222 db3a13fc の観潮船の一文の追加（しおりえ(制作補助2)、企画運営の指摘 10/11）
 * 今治地方観光協会 https://www.oideya.gr.jp/spot-c/tyoryu_yoshiumi/ に「12月～2月は団体予約（5名様以上）のみ運行」とあるので、通年のしおりとして冬の運航を書き足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-222b-db3a13fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "db3a13fc-e98e-4299-9f52-ca2842637553";
const COMMIT = process.argv.includes("--commit");
const FROM = "運航の時刻は潮の流れで日によって変わるので、事前に確かめましょう。";
const TO = "運航の時刻は潮の流れで日によって変わり、12月〜2月は5人以上の団体の予約だけの運航になるので、公式の案内で事前に確かめましょう。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { name: "来島海峡急流観潮船", day: { itineraryId: ITINERARY_ID } } });
  if (spots.length !== 1 || !(spots[0].memo ?? "").includes(FROM)) throw new Error("構成が想定と違います");
  const memo = spots[0].memo!.replace(FROM, TO);
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
