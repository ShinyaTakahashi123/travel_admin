/**
 * #112 78026dc9の直し(6回目)。企画運営(15:12)の指摘3点に対応。
 * 1. 説明文を2日間の中身に合わせて書き直す
 * 2. 五重塔の結びが「8分」だったが、実際のデータ(紅葉谷公園の
 *    transitDurationMin)は7分なので文言を合わせる
 * 3. 千畳閣の書き出しに、宮島口からフェリーで渡る一言を追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const DESCRIPTION_OLD = "宮島最古の歴史を持つ大聖院と、紅葉の名所・紅葉谷公園。厳島神社や弥山とは違う、静かな宮島の祈りと自然を楽しむ1泊2日です。";
const DESCRIPTION_NEW =
  "1日目は、大聖院や大願寺、千畳閣、宮島水族館など、厳島神社や弥山とは違う宮島島内の見どころを歩いてめぐり、2日目は対岸の広島市内で、縮景園や広島城など城と庭をめぐる1泊2日です。";

const GOJUNOTO_FROM = "今も信仰の対象となっていますので、敬意を込めて見学しましょう。この後は、歩いておよそ8分、紅葉谷公園へ向かいましょう。";
const GOJUNOTO_TO = "今も信仰の対象となっていますので、敬意を込めて見学しましょう。この後は、歩いておよそ7分、紅葉谷公園へ向かいましょう。";

const SENJOKAKU_FROM = "宮島桟橋から歩いておよそ7分、千畳閣(豊国神社)に着きます。";
const SENJOKAKU_TO = "JR宮島口駅からフェリーでおよそ10分、宮島に着いたら、宮島桟橋から歩いておよそ7分、千畳閣(豊国神社)に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, description::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const gojunoto = await findSpotInItinerary(itinId, { spotName: "五重塔" });
  const senjokaku = await findSpotInItinerary(itinId, { spotName: "千畳閣" });

  if (rows[0].description !== DESCRIPTION_OLD) throw new Error("説明文が想定外です");
  if (!gojunoto.memo!.includes(GOJUNOTO_FROM)) throw new Error("五重塔の文言が想定外です");
  if (!senjokaku.memo!.includes(SENJOKAKU_FROM)) throw new Error("千畳閣の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION_NEW } });
  await updateSpotInItinerary(itinId, { spotId: gojunoto.id }, { memo: gojunoto.memo!.replace(GOJUNOTO_FROM, GOJUNOTO_TO) });
  await updateSpotInItinerary(itinId, { spotId: senjokaku.id }, { memo: senjokaku.memo!.replace(SENJOKAKU_FROM, SENJOKAKU_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
