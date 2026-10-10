/**
 * #38 02840020 雲場池の水鏡と旧軽井沢。軽井沢の紅葉さんぽ。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '02840020%'`);
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
    "雲場池",
    "1日目は、旧軽井沢の紅葉さんぽの最初にご案内する雲場池からです。",
    "1日目は、旧軽井沢の紅葉さんぽの最初に訪れる雲場池からです。",
    "雲場池"
  );
  await fixOne(
    "矢ケ崎公園",
    "雲場池の水鏡から旧軽井沢の教会建築、白糸の滝の清流まで、軽井沢の紅葉と歴史を巡る1日は、ここで終了です。お疲れさまでした。お帰りは、JR軽井沢駅からご利用ください。",
    "雲場池の水鏡から旧軽井沢の教会建築、白糸の滝の清流まで、軽井沢の紅葉と歴史を巡る1日は、ここで終わりです。お帰りは、JR軽井沢駅からご利用ください。",
    "矢ケ崎公園(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
