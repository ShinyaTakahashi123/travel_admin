/**
 * #466 2b2188a6 の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘）
 *   伊能忠敬旧宅: 料金の書き方（「無料で」）を外す
 *   小野川沿いの町並み: 位置が旧宅とほぼ同じだったので、小野川を少し下った中橋（OSM way 1037960134）に。「関東で初めて」を「とされ」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-466b-2b2188a6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2b2188a6-1fba-436c-9f73-91658f0a6386";
const COMMIT = process.argv.includes("--commit");

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const kyutaku = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "伊能忠敬旧宅" });
  const machi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "小野川沿いの町並み" });
  const kyutakuMemo = rep(kyutaku.memo ?? "", "忠敬が暮らした家で、無料で見学できます。", "忠敬が暮らした家で、中を見学できます。");
  let machiMemo = rep(machi.memo ?? "", "旧宅の前から、小野川沿いの町並みを歩きます。", "旧宅から、小野川沿いの町並みを中橋のほうへ歩きます。");
  machiMemo = rep(machiMemo, "平成8年12月に関東で初めて重要伝統的建造物群保存地区に選ばれ、", "平成8年12月に、関東で初めて重要伝統的建造物群保存地区に選ばれたとされ、");
  console.log(`旧宅: ${kyutakuMemo}`);
  console.log(`町並み: ${machiMemo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: kyutaku.id }, { memo: kyutakuMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: machi.id }, { memo: machiMemo, lat: 35.890579, lng: 140.498586 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
