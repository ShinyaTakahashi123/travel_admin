/**
 * #414 441b998a の追いの修正その3（しおりえ(制作補助2)、自分の点検で）
 * - まんが館: 「日本の漫画家として初めて文化功労者となった」を「〜となったことで知られる」にぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-414d-441b998a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "441b998a-82ce-43fd-849a-ee82c277dd46";
const COMMIT = process.argv.includes("--commit");
const OLD = "日本の漫画家として初めて文化功労者となった横山隆一氏を記念した";
const NEW = "日本の漫画家として初めて文化功労者となったことで知られる横山隆一氏を記念した";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "横山隆一記念まんが館" });
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
