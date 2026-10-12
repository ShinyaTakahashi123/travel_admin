/**
 * #103 5e4fe4d0 の直し(5回目)。法務(2026-10-01 10:46)の指摘:
 * ① 東尋坊「断崖から突き落とされたという言い伝え」(死に方の描写)を削除。
 *    「平泉寺の僧・東尋坊の名にちなむと伝えられています。」で文を終える。
 * ② 説明文「北陸有数の温泉地」→「北陸有数ともいわれる温泉地」(言い切りを避ける)
 * ③ あわら湯のまち広場の写真(ea03dd4e-...)を削除。sourceUrlが
 *    https://commons.wikimedia.org/wiki/File:Tsuruya_Awara_ac_(2).jpg で、
 *    法務の指摘どおり「つるや」という特定の1軒の宿の建物・看板を写した写真で
 *    あり、広場そのものの写真ではなかった。カバー画像(itinerary.thumbnailUrl)
 *    も同じ写真だったため、あわせてnullにする(他の6スポットに写真がなく、
 *    代わりの実在の広場の写真はWebSearch 2回では見つけられなかったため、
 *    写真なしの状態に戻す。あとで見つかれば追加する)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TOJINBO_FROM = "地名の由来は、平泉寺にいた乱暴者の僧・東尋坊が、1182年、仲間に誘われてこの地を訪れた際、断崖から突き落とされたという言い伝えによります。";
const TOJINBO_TO = "地名の由来は、平泉寺にいた乱暴者の僧・東尋坊の名にちなむと伝えられています。";

const DESC_FROM = "明治期に湧出した北陸有数の温泉地、あわら温泉。";
const DESC_TO = "明治期に湧出した、北陸有数ともいわれる温泉地、あわら温泉。";

const WRONG_PHOTO_ID = "ea03dd4e-2301-419e-806b-9d50ff0e76dc";
const WRONG_PHOTO_URL = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-22/%25E3%2581%2582%25E3%2582%258F%25E3%2582%2589%25E6%25B8%25A9%25E6%25B3%2589-9sjYvgramGdcPpiGEimvM6MYXIv5RN.jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, description, thumbnail_url from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  const description: string = rows[0].description;
  const thumbnailUrl: string | null = rows[0].thumbnail_url;
  const tojinbo = await findSpotInItinerary(itinId, { spotName: "東尋坊" });
  const photo = await prisma.photo.findUnique({ where: { id: WRONG_PHOTO_ID } });

  if (!tojinbo.memo!.includes(TOJINBO_FROM)) throw new Error("東尋坊の文言が想定外です");
  if (!description.includes(DESC_FROM)) throw new Error("説明文が想定外です");
  if (!photo || photo.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Tsuruya_Awara_ac_(2).jpg") throw new Error("写真の情報が想定外です");
  if (thumbnailUrl !== WRONG_PHOTO_URL) throw new Error("カバー画像が想定外です");
  console.log("確認OK: 3件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tojinbo.id }, { memo: tojinbo.memo!.replace(TOJINBO_FROM, TOJINBO_TO) });
  await prisma.itinerary.update({ where: { id: itinId }, data: { description: description.replace(DESC_FROM, DESC_TO), thumbnailUrl: null } });
  await prisma.photo.delete({ where: { id: WRONG_PHOTO_ID } });
  console.log("COMMITTED: 3件");
}
main().finally(() => prisma.$disconnect());
