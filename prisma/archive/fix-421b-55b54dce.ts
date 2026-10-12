/**
 * #421 55b54dce の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 * - 備中松山城: 山の上の城なので、安全の一言を足す（足元に気をつけて）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-421b-55b54dce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "55b54dce-3c63-4e62-b3c7-bf046d449f0f";
const COMMIT = process.argv.includes("--commit");
const OLD = "山の上の城なので、歩きやすい靴で出かけましょう。";
const NEW = "山の上の城で、登城道には坂や石段が続くので、歩きやすい靴で、足元に気をつけて歩きましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "備中松山城" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  console.log(s.memo.replace(OLD, NEW));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(OLD, NEW) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
