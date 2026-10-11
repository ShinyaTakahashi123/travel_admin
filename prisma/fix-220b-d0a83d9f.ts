/**
 * #220 d0a83d9f の追いの直し（しおりえ(制作補助2)、audit の注意）
 * - 呼子朝市: 「元旦を除く毎日、朝7時30分から昼12時まで」は日程・時刻の記載になるので「毎朝、昼ごろまで」に
 * - 遊覧船の乗り場から呼子港へは約200mなので、歩きを15分→5分にし、遊覧船を10:25〜11:25（60分）に（昼食は11:30から、以降は変えない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-220b-d0a83d9f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d0a83d9f-65f0-4364-aeb0-4a5310b9e7b0";
const COMMIT = process.argv.includes("--commit");
const A_FROM = "朝市は元旦を除く毎日、朝7時30分から昼12時まで開かれ、";
const A_TO = "朝市は毎朝、昼ごろまで開かれ、";
const K_FROM = "船を降りて、港沿いを歩いて約15分。";
const K_TO = "船を降りて、港沿いを歩いて約5分。";

async function main() {
  const a = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "呼子朝市" });
  const k = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "呼子港" });
  if (!a.memo?.includes(A_FROM) || !k.memo?.startsWith(K_FROM)) throw new Error("本文が想定と違います");
  console.log(`${A_TO}\n${K_TO}\n遊覧船 10:25〜11:25 / 呼子港 11:30（歩き5分）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "呼子朝市" }, { memo: a.memo!.replace(A_FROM, A_TO) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "七ツ釜の遊覧船（マリンパル呼子）" }, { stayDurationMin: 60 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "呼子港" }, {
      memo: k.memo!.replace(K_FROM, K_TO),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
    }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
