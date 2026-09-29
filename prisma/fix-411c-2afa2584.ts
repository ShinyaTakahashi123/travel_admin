/**
 * #411 2afa2584 の追いの修正その2（しおりえ(制作補助2)、法務の指摘）
 * - 織姫神社: 足利音頭の歌詞の引用は作詞者を確かめられないので、歌詞を引かない書き方に変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-411c-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const COMMIT = process.argv.includes("--commit");
const OLD = "「足利来るなら織姫様の 赤いお宮を目じるしに」と足利音頭に歌われる神社で、";
const NEW = "足利音頭にも「赤いお宮」と歌われる神社で、";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "足利織姫神社" });
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
