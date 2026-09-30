/**
 * 法務(2026-10-01 00:14)の指摘。#69 4124d576 熊野古道 大門坂。
 * 記録: docs/content/legal-review/見直し-1日4か所.md 最後の節(e7fca92)
 * - 補陀洛山寺: 「捨身行」「かつての信仰の厳しさ」→ 命を捨てる行を思わせる
 *   ので外し、「観音浄土を目指す『補陀洛渡海』の信仰で知られ、渡海船の
 *   復元模型があります」程度に
 * - 三重塔: 「拝観には別途拝観料が必要です」を外す
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '4124d576%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (spot.memo!.includes(to) && !spot.memo!.includes(from)) return console.log(`すでに反映済み: ${label}`);
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "補陀洛山寺",
    "南海の彼方にあるとされる観音浄土「補陀落」を目指し、小舟で単身出発する「補陀洛渡海」という捨身行が、平安時代から江戸時代にかけてこの地から行われていました。本堂には、平安時代作と伝わる国の重要文化財・木造千手観音立像が安置されています。境内には、渡海船を復元した実物大の模型も展示され、かつての信仰の厳しさを今に伝えています。",
    "南海の彼方にあるとされる観音浄土を目指す「補陀洛渡海」の信仰で知られています。本堂には、平安時代作と伝わる国の重要文化財・木造千手観音立像が安置されています。境内には、渡海船を復元した実物大の模型もあります。",
    "補陀洛山寺"
  );
  await fixOne(
    "三重塔",
    "エレベーターで上れる最上階からは、那智の滝を望む景色を楽しめます。拝観には別途拝観料が必要です。",
    "エレベーターで上れる最上階からは、那智の滝を望む景色を楽しめます。",
    "三重塔"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
