/**
 * #489 8d2e4984 の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘）
 *   近江町市場: 主計町から歩いて20分に（時刻の計算を合わせる）
 *   合掌造り民家園: 八幡神社から0.4kmなので歩き10分にし、13:50〜14:30（40分）に
 *   相倉合掌造り集落: 「三大産業」を「主な産業」に（言い切りの言い方を避ける）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-489b-8d2e4984.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8d2e4984-c29c-43dd-a049-b39c6bbb8b5b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const FROM = "江戸時代の五箇山の三大産業だった塩硝・養蚕・和紙づくりの道具";
const TO = "江戸時代の五箇山の主な産業だった塩硝・養蚕・和紙づくりの道具";

async function main() {
  const omicho = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "近江町市場" });
  const minkaen = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotName: "合掌造り民家園" });
  const ainokura = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 4, spotName: "相倉合掌造り集落" });
  if (!(ainokura.memo ?? "").includes(FROM)) throw new Error("相倉の本文が想定と違います");
  console.log("近江町 walk 20／民家園 13:50〜14:30 walk 10／相倉の言い方");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: omicho.id }, { transitDurationMin: 20 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: minkaen.id }, { visitTime: t(13, 50), stayDurationMin: 40, transitDurationMin: 10 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 4, spotId: ainokura.id }, { memo: (ainokura.memo ?? "").replace(FROM, TO) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
