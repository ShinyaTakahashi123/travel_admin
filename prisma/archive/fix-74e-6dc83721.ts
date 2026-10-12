/**
 * 法務(2026-10-01 00:14)の指摘。#74 6dc83721 さいたま新都心けやきひろば。
 * 記録: docs/content/legal-review/見直し-1日4か所.md 最後の節(e7fca92)
 * - けやきひろば: 「GMOアリーナさいたま」(命名権の会社名)を外し、
 *   「さいたまスーパーアリーナ」だけに
 * - 氷川神社: 「関東随一の格式を誇ってきました」→ ぼかす
 * - 大宮公園小動物園: 「動物に食べ物をあげたり、さくに手を入れたりしない
 *   ようにしましょう。」を追加
 * - さいたま清河寺温泉: 「長湯を避けて、こまめに水分をとりましょう。」を追加
 * - 玉蔵院: 「浦和でも指折りの歴史を持つ」→ ぼかす
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
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
    "けやきひろば",
    "GMOアリーナさいたま（さいたまスーパーアリーナ）に隣接するこの広場は、",
    "さいたまスーパーアリーナに隣接するこの広場は、",
    "けやきひろば"
  );
  await fixOne(
    "武蔵一宮氷川神社",
    "「武蔵国一宮」として長く関東随一の格式を誇ってきました。",
    "「武蔵国一宮」として長く篤い信仰を集めてきました。",
    "武蔵一宮氷川神社"
  );
  await fixOne(
    "大宮公園小動物園",
    "公園の中にありながら、多彩な動物たちと出会える人気のスポットです。",
    "公園の中にありながら、多彩な動物たちと出会える人気のスポットです。動物に食べ物をあげたり、さくに手を入れたりしないようにしましょう。",
    "大宮公園小動物園"
  );
  await fixOne(
    "さいたま清河寺温泉",
    "入浴の際は、ほかの入浴客を撮らないようにしましょう。",
    "入浴の際は、ほかの入浴客を撮らないようにしましょう。長湯を避けて、こまめに水分をとりましょう。",
    "さいたま清河寺温泉"
  );
  await fixOne(
    "玉蔵院",
    "平安時代、弘法大師によって開かれたと伝わる真言宗の古刹で、浦和でも指折りの歴史を持つ寺院です。",
    "平安時代、弘法大師によって開かれたと伝わる真言宗の古刹で、浦和に古くから伝わる寺院です。",
    "玉蔵院"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
