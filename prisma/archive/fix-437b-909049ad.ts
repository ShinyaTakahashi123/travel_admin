/**
 * #437 909049ad の追いの修正（しおりえ(制作補助2)、法務の指摘・安全）: 川平湾の「海に入るときは、現地の案内や決まりに従いましょう」は海に入れるように読めるので、
 *   「湾内は潮の流れが速く、遊泳禁止となっているので、海には入らず、グラスボートや浜からの眺めを楽しみましょう」に
 *   出典: 沖縄観光コンベンションビューロー「おきなわ物語」川平湾 https://www.okinawastory.jp/spot/1377 （湾内は潮の流れが速く、遊泳禁止）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-437b-909049ad.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "909049ad-4221-402a-b7e0-61d8d794adb7";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "川平湾" });
  const from = "海に入るときは、現地の案内や決まりに従いましょう。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "湾内は潮の流れが速く、遊泳禁止となっているので、海には入らず、グラスボートや浜からの眺めを楽しみましょう。");
  console.log(memo.slice(-120));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
