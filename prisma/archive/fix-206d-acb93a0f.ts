/**
 * #206 acb93a0f 姫観音の言い方を出典に合わせる（しおりえ(制作補助2)、2026-10-01 自分の見直し）
 * - 「発電などのため」は出典にない。仙北市 https://www.city.semboku.akita.jp/sightseeing/spot/04_himekan.html の
 *   「国策によって玉川の強酸性の水を田沢湖に導入し貯水ダムとした」に合わせる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206d-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "acb93a0f-4b8d-457d-ac3b-f513903aed43";
const COMMIT = process.argv.includes("--commit");
const O = "昭和15年に、発電などのため玉川の強い酸性の水を湖に引き入れたことで、";
const N = "昭和15年に、国の方針で玉川の強い酸性の水を湖に引き入れ、湖を貯水のためのダムとしたことで、";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "白浜と姫観音" });
  if (!s.memo?.includes(O)) throw new Error("本文が想定と違います");
  if (!COMMIT) return console.log(`${O}\n→ ${N}\n確認モードです。--commit で書き込みます。`);
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(O, N) });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
