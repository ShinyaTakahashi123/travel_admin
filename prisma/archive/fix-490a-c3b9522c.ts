/**
 * #490 c3b9522c（会津・磐梯3泊4日）の飯盛山だけ、組み直しの前に先に直す（しおりえ(制作補助2)、2026-09-30 法務の依頼 docs/legal/20260930-death-wording-scan.md）
 * - 「自ら命を絶ちました」「亡くなった19人は、数え16・17歳」「自刃を選んだ」「見誤って自刃した」と手記の議論の話を外し、#422 と同じ形で「戊辰戦争で亡くなった白虎隊士の墓」に
 * - 残す事実: 白虎隊士中二番隊・戸ノ口原（会津若松観光ナビ https://www.aizukanko.com/course/787 ）、さざえ堂は国の重要文化財（https://www.aizukanko.com/spot/138 ）
 * 時刻・並び順は変えない（組み直しは fix-490-c3b9522c.ts で別に行う）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-490a-c3b9522c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "c3b9522c-ed27-4728-bf23-8eab5f95b521";
const COMMIT = process.argv.includes("--commit");
const MEMO =
  "戊辰戦争のとき、会津藩の若い藩士たちで編成された白虎隊士中二番隊が、戸ノ口原の戦いのあとにたどり着いた山です。山の中腹には、戊辰戦争で亡くなった白虎隊士の墓が並びます。山には、国の重要文化財に指定されている栄螺堂(さざえ堂)もあります。今も慰霊が続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "飯盛山" });
  if (!s.memo?.includes("自ら命を絶ちました")) throw new Error("本文が想定と違います");
  console.log(MEMO);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: s.id }, { memo: MEMO });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
