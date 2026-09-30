/**
 * #82 af71a6c9 21世紀美術館とにし茶屋街、モダンとレトロの金沢1泊2日。
 * 法務(2026-10-01 06:24)の2点。記録: docs/content/legal-review/
 * 見直し-1日4か所.md 最後の節(2429fb3)
 * - 国立工芸館: 「日本海側では初めてとなる」→「初めてとされる」
 * - にし茶屋街: 住む人への一文を追加(主計町・ひがし茶屋街と同じ趣旨)
 * あわせて見つけた口調の直し(「ご案内するのは」「お楽しみいただけた
 * ことでしょう」「お疲れさまでした」x2)も外し、にし茶屋街に欠けていた
 * 次のスポットへの案内も補った。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af71a6c9%'`);
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
    "国立工芸館",
    "令和2年(2020)に開館した、日本海側では初めてとなる国立美術館で、",
    "令和2年(2020)に開館した、日本海側では初めてとされる国立美術館で、",
    "国立工芸館"
  );
  await fixOne(
    "鈴木大拙館",
    "金沢の新しい建築と美術をめぐった1日目は、ここで終了です。お疲れさまでした。",
    "金沢の新しい建築と美術をめぐった1日目は、ここで終わりです。",
    "鈴木大拙館(口調)"
  );
  await fixOne(
    "にし茶屋街",
    "旅の2日目にご案内するのはにし茶屋街です。",
    "旅の2日目は、にし茶屋街からです。",
    "にし茶屋街(書き出し口調)"
  );
  await fixOne(
    "にし茶屋街",
    "通りの奥には、作家・島田清次郎が幼少期を過ごした茶屋を復元した「にし茶屋資料館」もあり、当時の茶屋の内部を見学することができます。ひがし茶屋街の華やかさとはまた違う、静かで奥ゆかしい金沢の花街文化を感じてみてください。モダンな21世紀美術館と、レトロなにし茶屋街、金沢の新旧の魅力を巡る旅をお楽しみいただけたことでしょう。",
    "通りの奥には、作家・島田清次郎が幼少期を過ごした茶屋を復元した「にし茶屋資料館」もあり、当時の茶屋の内部を見学することができます。ここも人が暮らし働く街です。路地に入るときは静かに、住まいの写真を撮らないよう配慮しましょう。ひがし茶屋街の華やかさとはまた違う、静かで奥ゆかしい金沢の花街文化を感じてみてください。この後は、歩いておよそ5分、妙立寺へ向かいましょう。",
    "にし茶屋街(住民配慮・結び)"
  );
  await fixOne(
    "ひがし茶屋街",
    "金沢21世紀美術館から、にし茶屋街、尾山神社とめぐった、モダンとレトロの金沢の旅も、ここで無事に終了です。お疲れさまでした。",
    "金沢21世紀美術館から、にし茶屋街、尾山神社とめぐった、モダンとレトロの金沢の旅も、ここで終わりです。",
    "ひがし茶屋街(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
