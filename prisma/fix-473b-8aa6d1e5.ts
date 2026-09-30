/**
 * #473 8aa6d1e5 の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘）
 *   玉川上水緑道: 記念館からの歩きを10分に（0.6km/5分は速すぎ）、10:25〜10:50（25分）
 *   国立天文台: 料金の書き方（「無料で」）を外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-473b-8aa6d1e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8aa6d1e5-c110-4e37-b4fa-916fc19c8417";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const josui = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "玉川上水緑道" });
  const nao = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "国立天文台 三鷹キャンパス" });
  const FROM = "見学コースを無料で歩けて、";
  if (!(nao.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const naoMemo = (nao.memo ?? "").replace(FROM, "見学コースを歩けて、");
  console.log(`玉川上水緑道: 歩き10分・10:25〜10:50 / 天文台: ${naoMemo.slice(0, 60)}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: josui.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 25)), stayDurationMin: 25, transitDurationMin: 10 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: nao.id }, { memo: naoMemo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
