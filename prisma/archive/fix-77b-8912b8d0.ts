/**
 * #77 8912b8d0 日光の社寺と中禅寺湖、湯西川・鬼怒川をめぐる雪見の1泊2日。
 * 法務(2026-10-01 06:24)の5点。記録: docs/content/legal-review/
 * 見直し-1日4か所.md 最後の節(2429fb3)
 * - 鬼怒川温泉ロープウェイ: 「金運・開運のご利益で知られる温泉神社」→
 *   「温泉神社」だけに
 * - おさるの山: 動物への一文を追加
 * - 二荒山神社: 「最も古い歴史を持つ」→「最も古い歴史を持つとされる」
 * - 川治ダム: 「指折りの高さを誇ります」→「指折りの高さとされます」
 * - 湯西川水の郷の大吊り橋: 安全の一文を追加
 * あわせて見つけた口調の直し(竜頭の滝・鬼怒川温泉ロープウェイの結び
 * 「お疲れさまでした」)も外した。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8912b8d0%'`);
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
    "竜頭の滝",
    "旅の1日目は、ここで終了です。お疲れさまでした。",
    "旅の1日目は、ここで終わりです。",
    "竜頭の滝(口調)"
  );
  await fixOne(
    "日光二荒山神社",
    "東照宮から歩いておよそ4分、日光山内で最も古い歴史を持つ日光二荒山神社に着きます。",
    "東照宮から歩いておよそ4分、日光山内で最も古い歴史を持つとされる日光二荒山神社に着きます。",
    "二荒山神社"
  );
  await fixOne(
    "湯西川水の郷",
    "2011年に完成した大吊り橋が新しいシンボルで、渓谷を見下ろしながら渡ることができます。橋のたもとには足湯もあり、",
    "2011年に完成した大吊り橋が新しいシンボルで、渓谷を見下ろしながら渡ることができます。橋は風などで揺れることがあるので、足元に気をつけながら渡りましょう。橋のたもとには足湯もあり、",
    "湯西川水の郷(安全)"
  );
  await fixOne(
    "川治ダム",
    "堤の高さはおよそ140mで、同じ形式のダムとしては国内でも指折りの高さを誇ります。",
    "堤の高さはおよそ140mで、同じ形式のダムとしては国内でも指折りの高さとされます。",
    "川治ダム"
  );
  await fixOne(
    "鬼怒川温泉ロープウェイ",
    "山頂エリアには、間近でニホンザルを観察できる「おさるの山」や、金運・開運のご利益で知られる温泉神社もあり、絶景と一緒に楽しめます。旅の締めくくりに、山の上から今回めぐった日光・奥日光・湯西川の景色を振り返ってみてください。日光の世界遺産から奥日光の湖と滝、平家の里や龍王峡とめぐった、雪見の1泊2日も、ここで無事に終了です。お疲れさまでした。",
    "山頂エリアには、間近でニホンザルを観察できる「おさるの山」や、温泉神社もあります。おさるの山では、決められた場所以外でえさをあげたり、サルに近づきすぎたりしないようにしましょう。旅の締めくくりに、山の上から今回めぐった日光・奥日光・湯西川の景色を振り返ってみてください。日光の世界遺産から奥日光の湖と滝、平家の里や龍王峡とめぐった、雪見の1泊2日も、ここで終わりです。",
    "鬼怒川温泉ロープウェイ(ご利益・おさるの山・口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
