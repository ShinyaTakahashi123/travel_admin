/**
 * #428 7a65702f の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 *   - 野田神社「明治維新の元勲・毛利敬親」→「幕末の長州藩主・毛利敬親」（「元勲」はふつう明治政府の中心になった人たちに使う）
 *   - 十朋亭維新館の座標: 地理院の住所検索（番地の代表点）→ OSM/Overpass の「維新史蹟 十朋亭」node 6813520227（34.182654,131.479830）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428e-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const noda = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "豊栄神社・野田神社" });
  const from = "明治維新の元勲・毛利敬親";
  if (!noda.memo?.includes(from)) throw new Error("野田神社の本文が想定と違います");
  const memo = noda.memo.replace(from, "幕末の長州藩主・毛利敬親");
  const jippo = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "十朋亭維新館" });
  console.log(memo.slice(0, 140));
  console.log(`十朋亭維新館: ${jippo.lat},${jippo.lng} → 34.182654,131.47983`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: noda.id }, { memo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: jippo.id }, { lat: 34.182654, lng: 131.47983 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
