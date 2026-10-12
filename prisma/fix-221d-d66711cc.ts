/**
 * #221 d66711cc の言い方の直し（しおりえ(制作補助2)、企画運営の指摘 10/11）
 * 「建設当時は世界一の斜張橋とされた」が、道の駅多々羅しまなみ公園と多々羅大橋の両方にあったので、道の駅のほうから外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-221d-d66711cc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "d66711cc-25fd-406e-b98d-3155df878f5c";
const COMMIT = process.argv.includes("--commit");
const FROM = "建設当時は世界一の斜張橋とされた多々羅大橋のそばにある道の駅で、";
const TO = "橋のすぐそばにある道の駅で、";

async function main() {
  const spots = await prisma.spot.findMany({ where: { name: "道の駅多々羅しまなみ公園", day: { itineraryId: ITINERARY_ID } } });
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
