/**
 * #31の直し(自己点検)。説明文が「徒歩でめぐる」のままで、祐徳稲荷神社・バスでの
 * 移動・昼食スポットの追加が反映されていなかったため更新する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "6ef3e7a8-2b31-498d-9023-a6fb7c7072da";

const OLD_DESC =
  "国の重要伝統的建造物群保存地区、肥前浜宿の酒蔵通りと旧乗田家住宅、対岸の浜庄津町浜金屋町の町並みから、観光酒蔵の肥前屋、昭和5年(1930)築の木造駅舎を生かした肥前浜駅のHAMA BARまで、徒歩でめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const NEW_DESC =
  "国の重要伝統的建造物群保存地区、肥前浜宿の酒蔵通りと旧乗田家住宅、対岸の浜庄津町浜金屋町の町並みから、観光酒蔵の肥前屋、日本三大稲荷の一つとされる祐徳稲荷神社、昭和5年(1930)築の木造駅舎を生かした肥前浜駅のHAMA BARまで、徒歩とバスでめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("想定と違います");

  console.log("[確認OK] 説明文に祐徳稲荷神社・バス・昼食を反映");
  console.log("新説明文:", NEW_DESC);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
