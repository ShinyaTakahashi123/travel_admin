/**
 * #33の直し(自己点検)。説明文に旧光本家住宅が反映されていなかったため追加。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "9254ab1d-e6e5-47c9-8ab3-c3d5331c59fc";

const OLD_DESC =
  "「安芸の小京都」と呼ばれる竹原町並み保存地区を中心に、道の駅たけはら、清水寺を模したという西方寺・普明閣、豪商の屋敷・旧松阪家住宅、竹原市歴史民俗資料館、照蓮寺、日本のウイスキーの父・竹鶴政孝の生家をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学は、内容が変わることがあるので、お出かけ前に各施設の公式の案内で確かめましょう。";

const NEW_DESC =
  "「安芸の小京都」と呼ばれる竹原町並み保存地区を中心に、道の駅たけはら、清水寺を模したという西方寺・普明閣、豪商の屋敷・旧松阪家住宅、竹原市歴史民俗資料館、照蓮寺、陶芸作品を展示する旧光本家住宅、日本のウイスキーの父・竹鶴政孝の生家をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学は、内容が変わることがあるので、お出かけ前に各施設の公式の案内で確かめましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("想定と違います");

  console.log("[確認OK] 説明文に旧光本家住宅を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
