/**
 * #495 e9a900e3 の事実の直し（しおりえ(制作補助2)、2026-10-01 #203 の見直しで気づいた）
 * - 松山城: 天守の再建を「嘉永5年（1852年）」と書いていたが、松山城公式 https://www.matsuyamajo.jp/discover/history.html では
 *   「文政3年（1820）から再建工事に着手し、35年の歳月を経て安政元年（1854）に落成」なので直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-495c-e9a900e3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e9a900e3-b17f-4078-bea9-406de0c438d6";
const COMMIT = process.argv.includes("--commit");
const O = "今の天守群は、落雷で焼けたのち嘉永5年（1852年）に再建されたもので、";
const N = "今の天守は、落雷で焼けたのち安政元年（1854年）に再び完成したもので、";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotName: "松山城" });
  if (!s.memo?.includes(O)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(O, N);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
