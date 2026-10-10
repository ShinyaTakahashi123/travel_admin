/**
 * #98 3d8afccd の直し(2回目)。法務(2026-10-01 10:46)の指摘:
 * ① 菅沼・白川郷(今も人が暮らす集落)に、住む人への一文を追加(相倉と同じ)
 * ② 岩瀬家「もっとも大きい合掌造り家屋です」→「もっとも大きいとされる
 *    合掌造り家屋です」(言い切りを避ける)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const SUGANUMA_FROM = "暮らしの道具などおよそ300点が展示されています。ここで昼食にしましょう。";
const SUGANUMA_TO = "暮らしの道具などおよそ300点が展示されています。この集落も今も人々が暮らす場で、窓越しに家の中をのぞき込むようなことは控え、住民の暮らしに敬意を払いましょう。ここで昼食にしましょう。";

const IWASEKE_FROM = "五箇山・白川郷を通じてもっとも大きい合掌造り家屋です。";
const IWASEKE_TO = "五箇山・白川郷を通じてもっとも大きいとされる合掌造り家屋です。";

const SHIRAKAWAGO_FROM = "国の重要文化財に指定されている和田家をはじめ、内部を見学できる合掌造りの家屋も点在しています。相倉・菅沼の静かな佇まいから";
const SHIRAKAWAGO_TO = "国の重要文化財に指定されている和田家をはじめ、内部を見学できる合掌造りの家屋も点在しています。この集落も今も人々が暮らす場で、窓越しに家の中をのぞき込むようなことは控え、住民の暮らしに敬意を払いましょう。相倉・菅沼の静かな佇まいから";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3d8afccd%'`);
  const itinId = rows[0].id;

  const suganuma = await findSpotInItinerary(itinId, { spotName: "菅沼合掌造り集落" });
  const iwaseke = await findSpotInItinerary(itinId, { spotName: "岩瀬家" });
  const shirakawago = await findSpotInItinerary(itinId, { spotName: "白川郷" });

  if (!suganuma.memo!.includes(SUGANUMA_FROM)) throw new Error("菅沼の文言が想定外です");
  if (!iwaseke.memo!.includes(IWASEKE_FROM)) throw new Error("岩瀬家の文言が想定外です");
  if (!shirakawago.memo!.includes(SHIRAKAWAGO_FROM)) throw new Error("白川郷の文言が想定外です");
  console.log("確認OK: 3件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: suganuma.id }, { memo: suganuma.memo!.replace(SUGANUMA_FROM, SUGANUMA_TO) });
  await updateSpotInItinerary(itinId, { spotId: iwaseke.id }, { memo: iwaseke.memo!.replace(IWASEKE_FROM, IWASEKE_TO) });
  await updateSpotInItinerary(itinId, { spotId: shirakawago.id }, { memo: shirakawago.memo!.replace(SHIRAKAWAGO_FROM, SHIRAKAWAGO_TO) });
  console.log("COMMITTED: 3件");
}
main().finally(() => prisma.$disconnect());
