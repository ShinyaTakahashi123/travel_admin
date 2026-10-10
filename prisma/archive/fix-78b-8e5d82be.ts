/**
 * #78 8e5d82be 伊根の舟屋と丹後の海を満喫する、1泊2日のんびり漁村旅。
 * 法務(2026-10-01 06:24)の4点。記録: docs/content/legal-review/
 * 見直し-1日4か所.md 最後の節(2429fb3)
 * - 伊根の舟屋: 住む人への一文を追加。「漁村として全国で初めて」→
 *   「漁村として全国で初めてとされる」
 * - 伊根湾めぐり遊覧船: 船の安全の一文とえさやりの一文を追加
 * - 由良川橋梁: 「線路や鉄橋には立ち入らないようにしましょう」を追加
 * あわせて見つけた口調の直し(夕日ヶ浦海岸・天橋立の結び「お疲れさまでした」)
 * も外した。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8e5d82be%'`);
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
    "伊根の舟屋",
    "現在も約230軒の舟屋が軒を連ね、2005年には漁村として全国で初めて、国の重要伝統的建造物群保存地区に選定されました。のんびり歩いて、独特の景観を写真におさめましょう。",
    "現在も約230軒の舟屋が軒を連ね、2005年には漁村として全国で初めてとされる、国の重要伝統的建造物群保存地区に選定されました。舟屋は今も人が暮らす住まいです。敷地や桟橋に入ったり、住まいや人に向けて撮影したりしないようにしましょう。のんびり歩いて、独特の景観を写真におさめましょう。",
    "伊根の舟屋"
  );
  await fixOne(
    "伊根湾めぐり遊覧船",
    "船のあとをついてくるカモメやトビにエサをあげることもでき、大人から子供まで人気の体験です。",
    "船内では係員の案内に従いましょう。船のあとをついてくるカモメやトビにエサをあげることもできますが、手から食べ物をとられないよう気をつけましょう。",
    "伊根湾めぐり遊覧船"
  );
  await fixOne(
    "由良川橋梁",
    "赤さび色に染まった鉄橋を、日本海を背景に列車が渡っていく光景は、鉄道ファンでなくても目を引く絶景として知られています。この後は、車でおよそ20分、智恩寺へ向かいましょう。",
    "赤さび色に染まった鉄橋を、日本海を背景に列車が渡っていく光景は、鉄道ファンでなくても目を引く絶景として知られています。線路や鉄橋には立ち入らないようにしましょう。この後は、車でおよそ20分、智恩寺へ向かいましょう。",
    "由良川橋梁"
  );
  await fixOne(
    "夕日ヶ浦海岸",
    "1日目は、ここで終了です。お疲れさまでした。",
    "1日目は、ここで終わりです。",
    "夕日ヶ浦海岸(口調)"
  );
  await fixOne(
    "天橋立",
    "伊根の舟屋から丹後の海辺、天橋立とめぐった、のんびり漁村旅も、ここで無事に終了です。お疲れさまでした。",
    "伊根の舟屋から丹後の海辺、天橋立とめぐった、のんびり漁村旅も、ここで終わりです。",
    "天橋立(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
