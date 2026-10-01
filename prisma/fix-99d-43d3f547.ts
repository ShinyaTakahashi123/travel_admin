/**
 * #99 43d3f547 の直し(4回目)。法務(2026-10-01 10:46)の指摘:
 * ① 説明文「中村藤吉本店の抹茶スイーツ」→ 店名は書かない決まりのため
 *    「宇治の抹茶スイーツ」に直す(中村藤吉本店はfix-99cでスポットからも
 *    外したため、説明文にだけ店名が残っていた)
 * ② 月桂冠大倉記念館の利き酒に、飲酒に関する一文を追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const DESC_FROM = "1日目は中村藤吉本店の抹茶スイーツと宇治の世界遺産、2日目は寺田屋や十石舟で幕末の伏見情緒を味わい、伏見稲荷大社の千本鳥居で締めくくる1泊2日です。";
const DESC_TO = "1日目は宇治の抹茶スイーツと世界遺産、2日目は寺田屋や十石舟で幕末の伏見情緒を味わい、伏見稲荷大社の千本鳥居で締めくくる1泊2日です。";

const GEKKEIKAN_FROM = "見学の最後には、利き酒も楽しめます。";
const GEKKEIKAN_TO = "見学の最後には、利き酒も楽しめます。お酒は20歳になってから。車を運転する人は飲まないでください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, description from itinerary where id::text like '43d3f547%'`);
  const itinId = rows[0].id;
  const description: string = rows[0].description;
  const gekkeikan = await findSpotInItinerary(itinId, { spotName: "月桂冠大倉記念館" });

  if (!description.includes(DESC_FROM)) throw new Error("説明文が想定外です");
  if (!gekkeikan.memo!.includes(GEKKEIKAN_FROM)) throw new Error("月桂冠大倉記念館の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { description: DESC_TO } });
  await updateSpotInItinerary(itinId, { spotId: gekkeikan.id }, { memo: gekkeikan.memo!.replace(GEKKEIKAN_FROM, GEKKEIKAN_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
