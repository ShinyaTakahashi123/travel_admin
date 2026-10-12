/**
 * #67 2fd67b8b グランフロントと中崎町、新旧が交わる梅田さんぽ旅。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '2fd67b8b%'`);
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
    "露天神社（お初天神）",
    "本日最初にご案内するのは、露天神社です。",
    "旅の始まりは、露天神社です。",
    "露天神社(書き出し)"
  );
  await fixOne(
    "グラングリーン大阪（うめきた公園）",
    "次にご案内するのは、JR大阪駅の北側に広がる、グラングリーン大阪です。",
    "次に訪れるのは、JR大阪駅の北側に広がる、グラングリーン大阪です。",
    "グラングリーン大阪"
  );
  await fixOne(
    "大阪市立東洋陶磁美術館",
    "中之島の建築めぐりも、1日目はここで締めくくりです。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。",
    "中之島の建築めぐりも、1日目はここで締めくくりです。今夜はこの近くの宿でゆっくり休みましょう。",
    "大阪市立東洋陶磁美術館(口調)"
  );
  await fixOne(
    "大阪歴史博物館",
    "2日間の梅田さんぽ旅も、ここで無事に終了です。お疲れさまでした。お帰りは、大阪メトロ谷町線・中央線「谷町四丁目駅」(徒歩およそ3分)からご利用ください。",
    "2日間の梅田さんぽ旅も、ここで終わりです。お帰りは、大阪メトロ谷町線・中央線「谷町四丁目駅」(徒歩およそ3分)からご利用ください。",
    "大阪歴史博物館(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
