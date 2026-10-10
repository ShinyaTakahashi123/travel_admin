/**
 * #91 11ddbe6f fix-91の直後の直し。itinerary-auditで2件の指摘。
 * 1) ニシハマビーチ: 「間60分/移動50分」の食い違い。とまりんの10分滞在+
 *    高速船50分+港からビーチまでの徒歩を含めて60分に修正。
 * 2) 阿嘉ビーチ: 前浜ビーチとは実際には0.2kmしか離れておらず、レンタサイクル
 *    10分は近すぎて不自然だったため5分に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NISHIHAMA_FROM = "とまりんから高速船でおよそ50分、阿嘉港に着き、阿嘉島のメインビーチ、ニシハマビーチにやってきました。";
const NISHIHAMA_TO = "とまりんから高速船とビーチまでの徒歩で1時間ほど、阿嘉港に着き、阿嘉島のメインビーチ、ニシハマビーチにやってきました。";

const AKABEACH_FROM = "前浜ビーチからレンタサイクルでおよそ10分、阿嘉ビーチに着きます。";
const AKABEACH_TO = "前浜ビーチからレンタサイクルでおよそ5分、阿嘉ビーチに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;

  const nishihama = await findSpotInItinerary(itinId, { spotName: "ニシハマビーチ" });
  const akabeach = await findSpotInItinerary(itinId, { spotName: "阿嘉ビーチ" });

  if (!nishihama.memo!.includes(NISHIHAMA_FROM)) throw new Error("一致しません(ニシハマ)");
  if (!akabeach.memo!.includes(AKABEACH_FROM)) throw new Error("一致しません(阿嘉ビーチ)");

  console.log("すべて一致確認OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: nishihama.id }, {
    memo: nishihama.memo!.replace(NISHIHAMA_FROM, NISHIHAMA_TO),
    transitDurationMin: 60,
  });
  await updateSpotInItinerary(itinId, { spotId: akabeach.id }, {
    memo: akabeach.memo!.replace(AKABEACH_FROM, AKABEACH_TO),
    visitTime: t(13, 20),
    transitDurationMin: 5,
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
