/**
 * #395 f62dcf1c の追いの修正（しおりえ(制作補助2)、企画運営・法務の指摘）
 * - 旧金子家住宅: 開いたページで確かめられなかった「昭和の初めごろの店先」「幕末の土蔵」「天水甕」を外し、
 *   確かめられた事実（江戸時代後期の伝統的な建物・市の有形文化財、明治初期に呉服・太物の卸商を創業、主屋と土蔵）で書き直す
 *   出典: https://www.akita-yulala.jp/see/200010038 ／ https://ja.wikipedia.org/wiki/秋田市民俗芸能伝承館
 * - 秋田市民市場: 地酒を扱うので「お酒は20歳から。」を足す（法務）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-395b-f62dcf1c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f62dcf1c-c574-4658-8654-5492cbca334e";
const COMMIT = process.argv.includes("--commit");

const MEMO_KANEKO =
  "ねぶり流し館のとなりにある、江戸時代後期の伝統的な町家の建物で、秋田市の有形文化財に指定されています。明治の初めに呉服・太物（綿や麻の織物）の卸商を始めた商家で、主屋と土蔵からなっています。城下町の商人の暮らしを感じてみましょう。";
const OLD_ICHIBA = "きりたんぽ鍋の材料や秋田の地酒も扱っています。";
const NEW_ICHIBA = "きりたんぽ鍋の材料や秋田の地酒も扱っています。お酒は20歳から。";

async function main() {
  const kaneko = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "旧金子家住宅" });
  const ichiba = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "秋田市民市場" });
  if (!ichiba.memo?.includes(OLD_ICHIBA)) throw new Error("市民市場の本文が想定と違います");
  console.log("旧金子家住宅:", MEMO_KANEKO, "\n秋田市民市場:", NEW_ICHIBA);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: kaneko.id }, { memo: MEMO_KANEKO }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: ichiba.id }, { memo: ichiba.memo!.replace(OLD_ICHIBA, NEW_ICHIBA) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
