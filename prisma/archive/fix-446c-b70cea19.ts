/**
 * #446 b70cea19 の一言の追加（しおりえ(制作補助2)、企画運営の指摘: 決まり3「1日目の朝の移動は『〇〇駅から△△で約×分』とメモに書く」）
 *   鋸山ロープウェーの書き出しを「JR内房線の浜金谷駅から、国道127号線を館山方面へ歩いて約8分で山麓駅へ」に（日本寺 access・ロープウェー公式: 浜金谷駅より徒歩8分）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-446c-b70cea19.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b70cea19-5343-44a7-b398-e534425c1827";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "鋸山ロープウェー" });
  const from = "浜金谷駅から国道127号線を館山方面へ歩いて8分ほどの山麓駅から、鋸山ロープウェーで山頂駅へ。";
  const to = "JR内房線の浜金谷駅から、国道127号線を館山方面へ歩いて約8分で山麓駅へ。鋸山ロープウェーで山頂駅へ上ります。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`ロープウェー: ${memo.slice(0, 110)}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
