/**
 * #130 d1f4dd69の直し(5回目)。企画運営(2026-10-11)の指摘。
 *
 * 1. 万葉文化館の「2026年に国宝指定」「実物は飛鳥資料館で展示」の
 *    出典を、online.bunka.go.jp/heritages/detail/570311をWebFetchで
 *    2回確認したが、どちらも確認できなかった(ページは「重要文化財」
 *    「指定年月日:20250926」とあり、展示場所の記載はない)。企画運営の
 *    指示(確かめられなければ消す)に沿って、両方の文を削除する。
 * 2. 石舞台古墳の「今も石室の中に入ることができるので、巨石の迫力を
 *    ゆっくりと楽しみましょう」が、feb07068・0e15e22bの「現在も石室の
 *    中に入ることができるので、ゆっくりと巨石の迫力を楽しんでください」
 *    とまだ近い(70%)ため、言い方・構成を変える。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const MANYOBUNKAKAN_FROM =
  "2026年には、この飛鳥池遺跡から出土した品々が国宝に指定されました。地下の展示室では、映像や模型で万葉の時代の空気を感じられるほか、特別展示室では富本銭のレプリカや資料も見学できます(国宝の実物は飛鳥資料館で展示されています)。";
const MANYOBUNKAKAN_TO =
  "地下の展示室では、映像や模型で万葉の時代の空気を感じられるほか、特別展示室では富本銭のレプリカや資料も見学できます。";

const ISHIBUTAI_FROM = "今も石室の中に入ることができるので、巨石の迫力をゆっくりと楽しみましょう。";
const ISHIBUTAI_TO = "石室の中まで足を踏み入れることができ、周囲を囲む巨石の大きさを間近で体感できます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1f4dd69%'`);
  const itinId = rows[0].id;

  const manyobunkakan = await findSpotInItinerary(itinId, { spotName: "奈良県立万葉文化館" });
  const ishibutai = await findSpotInItinerary(itinId, { spotName: "石舞台古墳" });

  if (!manyobunkakan.memo?.includes(MANYOBUNKAKAN_FROM)) throw new Error("万葉文化館の文言が想定外です");
  if (!ishibutai.memo?.includes(ISHIBUTAI_FROM)) throw new Error("石舞台古墳の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: manyobunkakan.id }, { memo: manyobunkakan.memo!.replace(MANYOBUNKAKAN_FROM, MANYOBUNKAKAN_TO) });
  await updateSpotInItinerary(itinId, { spotId: ishibutai.id }, { memo: ishibutai.memo!.replace(ISHIBUTAI_FROM, ISHIBUTAI_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
