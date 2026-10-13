/**
 * #32の直し(自己点検)。説明文に野村家が反映されていなかったため追加。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "8347d735-5bd3-456d-bc73-c0379b50cdaa";

const OLD_DESC =
  "加賀藩士の屋敷跡が続く長町武家屋敷跡、藩祖・前田利家を祀る尾山神社、金沢の台所と呼ばれる近江町市場、浅野川沿いの主計町茶屋街から、寛永2年(1625)創業と伝わる、金沢で最も古い蔵元とされる福光屋まで、バスと徒歩でめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const NEW_DESC =
  "加賀藩士の屋敷跡が続く長町武家屋敷跡、屋敷内を見学できる野村家、藩祖・前田利家を祀る尾山神社、金沢の台所と呼ばれる近江町市場、浅野川沿いの主計町茶屋街から、寛永2年(1625)創業と伝わる、金沢で最も古い蔵元とされる福光屋まで、バスと徒歩でめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("想定と違います");

  console.log("[確認OK] 説明文に野村家を追加");
  console.log("新説明文:", NEW_DESC);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
