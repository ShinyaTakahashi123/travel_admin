/**
 * #85 c5aee4db 企画運営の指摘(2026-09-30 19:03)。このしおりの説明文には
 * 「丹後半島をぐるり一周する1泊2日ドライブです」とあり、1日目は車の旅。
 * fix-85bでD2を登山バス・丹後鉄道・コミュニティバスの公共交通に変えたのは
 * 逆行(決まり8=旅の足のつじつまを合わせる)だったため、車の旅として直す。
 *
 * 実際の組み立て: 車は宿(智恩寺そば、1日目の宿泊エリア)に置いたまま、
 * 天橋立観光船で一の宮側(府中)へ渡り(復路の実測で片道およそ12分、天橋立
 * 観光協会の情報で確認)、ケーブルカーと登山バスを乗り継いで山上の成相寺・
 * 傘松公園・籠神社をめぐったあと、天橋立(砂州)を歩いて南側(文珠)へ戻り、
 * 宿そばに置いた車を回収。そこから加悦の地区へは車で移動(OSRM実測
 * 12.6km/12分)。天橋立の滞在50分は、この砂州を歩いて渡る時間として
 * 使うことにする(往路は観光船、帰路は徒歩というよくある周り方)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NARISHO_FROM = "西国三十三所の霊場で、天橋立を一望できる山寺です。";
const NARISHO_TO =
  "車は宿に置いたまま、天橋立観光船で一の宮側へ渡り(およそ12分)、ケーブルカーと登山バスを乗り継いで山を登ります。西国三十三所の霊場で、天橋立を一望できる山寺です。";

const KAYA_FROM =
  "天橋立から徒歩で天橋立駅へ向かい、京都丹後鉄道で与謝野駅までおよそ15分、与謝野町のコミュニティバスに乗り継いでおよそ15分、加悦の地区に着きます(乗り継ぎ待ちを含めるとおよそ50分。バスの本数が少ないので、事前に時刻を確かめましょう)。大正15年（1926年）に建てられた木造洋風の駅舎です。";
const KAYA_TO =
  "天橋立を歩いて渡り、文珠に置いていた車に乗って、加悦の地区まで車でおよそ12分。大正15年（1926年）に建てられた木造洋風の駅舎です。";

const BITOKE_FROM = "お帰りは、与謝野町のコミュニティバスと京都丹後鉄道で天橋立駅方面へ向かいましょう。";
const BITOKE_TO = "お帰りは、車で丹後半島をあとにしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;

  const narisho = await findSpotInItinerary(itinId, { spotName: "成相寺" });
  if (!narisho.memo!.includes(NARISHO_FROM)) throw new Error("一致しません(成相寺)");
  const narishoNewMemo = narisho.memo!.split(NARISHO_FROM).join(NARISHO_TO);

  const kaya = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  if (!kaya.memo!.includes(KAYA_FROM)) throw new Error("一致しません(加悦駅舎)");
  const kayaNewMemo = kaya.memo!.split(KAYA_FROM).join(KAYA_TO);

  const bitoke = await findSpotInItinerary(itinId, { spotName: "旧尾藤家住宅" });
  if (!bitoke.memo!.includes(BITOKE_FROM)) throw new Error("一致しません(旧尾藤家住宅)");
  const bitokeNewMemo = bitoke.memo!.split(BITOKE_FROM).join(BITOKE_TO);

  console.log("成相寺: OK");
  console.log("加悦駅舎: OK");
  console.log("旧尾藤家住宅: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: narisho.id }, { memo: narishoNewMemo });
  await updateSpotInItinerary(itinId, { spotId: kaya.id }, { memo: kayaNewMemo, transitMode: "car", transitDurationMin: 12 });
  await updateSpotInItinerary(itinId, { spotId: bitoke.id }, { memo: bitokeNewMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
