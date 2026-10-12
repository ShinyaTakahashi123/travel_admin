/**
 * #389 ecdd6ad8 の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - 金峯神社: 奥千本口行きのバスが運行しない時期の行き方（タクシー、または中千本から歩いて上る）を一文足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-389c-ecdd6ad8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ecdd6ad8-31a0-4e4d-9816-7297a3025225";
const COMMIT = process.argv.includes("--commit");

const OLD = "（バスは桜の時期などに運行するので、時刻は公式の案内で確かめてください）。";
const NEW =
  "（バスは桜の時期などに運行するので、時刻は公式の案内で確かめてください。バスが運行していない時期は、タクシーを使うか、中千本から坂道を歩いて上りましょう。歩くと1時間以上かかります）。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "金峯神社" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(OLD, NEW);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
