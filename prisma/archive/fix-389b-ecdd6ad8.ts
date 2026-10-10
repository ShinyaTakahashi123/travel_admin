/**
 * #389 ecdd6ad8 の追いの修正（しおりえ(制作補助2)）
 * - 竹林院群芳園: 寺院（宿坊）の庭なので、配慮の一文を足す
 * - 如意輪寺: 竹林院からの徒歩を30分→20分（直線0.7km。谷を下って上る道のため20分とする）、到着15:20・滞在70分（〜16:30）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-389b-ecdd6ad8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ecdd6ad8-31a0-4e4d-9816-7297a3025225";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OLD_CHIKURIN_TAIL = "竹林院は宿坊でもあるので、この日の宿にするのもよいでしょう。";
const NEW_CHIKURIN_TAIL = "竹林院は宿坊でもあるので、この日の宿にするのもよいでしょう。お寺の中の庭ですので、静かに、敬意をもって拝観しましょう。";
const OLD_NYOIRIN_HEAD = "竹林院から谷をはさんだ向かいの山すそへ歩いて約30分。";
const NEW_NYOIRIN_HEAD = "竹林院から谷をはさんだ向かいの山すそへ歩いて約20分。";

async function main() {
  const chikurin = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "竹林院群芳園" });
  const nyoirin = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "如意輪寺" });
  if (!chikurin.memo?.includes(OLD_CHIKURIN_TAIL) || !nyoirin.memo?.startsWith(OLD_NYOIRIN_HEAD)) throw new Error("本文が想定と違います");
  console.log("竹林院群芳園 →", chikurin.memo.replace(OLD_CHIKURIN_TAIL, NEW_CHIKURIN_TAIL).slice(-60));
  console.log("如意輪寺 → 15:20 滞在70 walk/20", nyoirin.memo.replace(OLD_NYOIRIN_HEAD, NEW_NYOIRIN_HEAD).slice(0, 40));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: chikurin.id }, { memo: chikurin.memo!.replace(OLD_CHIKURIN_TAIL, NEW_CHIKURIN_TAIL) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: nyoirin.id }, { visitTime: t(15, 20), stayDurationMin: 70, transitDurationMin: 20, memo: nyoirin.memo!.replace(OLD_NYOIRIN_HEAD, NEW_NYOIRIN_HEAD) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
