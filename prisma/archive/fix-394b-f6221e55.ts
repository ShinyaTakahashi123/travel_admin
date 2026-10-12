/**
 * #394 f6221e55 の追いの修正（しおりえ(制作補助2)、監査の警告への対応）
 * - 金刀比羅宮: 点は御本宮なので、金丸座からの移動に石段の上りを含めて徒歩40分・到着10:20・滞在100分に
 * - 鞘橋と門前町: 御本宮から石段を下りるので徒歩30分に（到着12:30は変えない）
 * - 旧金毘羅大芝居: 「現存する日本最古の芝居小屋として」→「現存する日本最古の芝居小屋とされ」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-394b-f6221e55.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f6221e55-7af6-415d-824e-98eb7b07e9f3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const OLD_K = "天保6年（1835年）に建てられた、現存する日本最古の芝居小屋として、国の重要文化財に指定されています。";
const NEW_K = "天保6年（1835年）に建てられた、現存する日本最古の芝居小屋とされ、国の重要文化財に指定されています。";

async function main() {
  const kana = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "旧金毘羅大芝居（金丸座）" });
  const konpira = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "金刀比羅宮" });
  const saya = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "鞘橋と門前町（昼食）" });
  if (!kana.memo?.includes(OLD_K)) throw new Error("金丸座の本文が想定と違います");
  console.log("金丸座:", NEW_K, "\n金刀比羅宮: walk40 10:20 滞在100\n鞘橋: walk30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: kana.id }, { memo: kana.memo!.replace(OLD_K, NEW_K) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: konpira.id }, { visitTime: t(10, 20), stayDurationMin: 100, transitDurationMin: 40 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: saya.id }, { transitDurationMin: 30 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
