/**
 * 法務(2026-10-01 00:14)の指摘。#72 55a33667 熱海サンビーチと商店街。
 * 記録: docs/content/legal-review/見直し-1日4か所.md 最後の節(e7fca92)
 * - 来宮神社: 「幹を一周すると寿命が一年延びる」を外す(#480と同じ)
 * - 熱海梅園: 「日本初の温泉療養施設」→「…とされる」
 * - ACAO FOREST: カフェの名前「COEDA HOUSE」を外す
 * あわせて、確認中に見つけたACAO FORESTの結び「お疲れさまでした。」
 * (ツアーガイド口調の禁止に該当)も外した。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '55a33667%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "来宮神社",
    "幹を一周すると寿命が一年延びるとも伝えられ、多くの参拝者が大楠のまわりをめぐる姿が見られます。",
    "多くの参拝者が大楠のまわりをめぐる姿が見られます。",
    "来宮神社"
  );
  await fixOne(
    "熱海梅園",
    "当時の内務省衛生局長・長与専斎の提唱で開かれた、日本初の温泉療養施設にあわせて整備された日本庭園です。",
    "当時の内務省衛生局長・長与専斎の提唱で開かれた、日本初の温泉療養施設とされる施設にあわせて整備された日本庭園です。",
    "熱海梅園"
  );
  await fixOne(
    "ACAO FOREST",
    "敷地内には、建築家・隈研吾が設計した、海を望むカフェ「COEDA HOUSE」もあります。",
    "敷地内には、建築家・隈研吾が設計した、海を望むカフェもあります。",
    "ACAO FOREST(カフェ名)"
  );
  await fixOne(
    "ACAO FOREST",
    "熱海サンビーチの散策から続いた、海と温泉、そして絶景をめぐる1泊2日のリラックス旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。",
    "熱海サンビーチの散策から続いた、海と温泉、そして絶景をめぐる1泊2日のリラックス旅も、ここで終わりです。お帰りは、駐車場に置いた車でご利用ください。",
    "ACAO FOREST(結び)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
