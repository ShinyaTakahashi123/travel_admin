/**
 * #475 9754ee3c の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘）
 *   別府ロープウェイ: 「九州最大級の101人乗りのゴンドラ」を言い切らない形に
 *   竹瓦小路: 歩き3分→5分（間5分に合わせる）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-475b-9754ee3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9754ee3c-be4b-4db8-838f-348335a26701";
const COMMIT = process.argv.includes("--commit");
const FROM = "九州最大級の101人乗りのゴンドラで、";
const TO = "九州最大級とされる101人乗りのゴンドラで、";

async function main() {
  const rw = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "別府ロープウェイ" });
  const alley = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "竹瓦小路" });
  if (!(rw.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (rw.memo ?? "").replace(FROM, TO);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: rw.id }, { memo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: alley.id }, { transitDurationMin: 5 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
