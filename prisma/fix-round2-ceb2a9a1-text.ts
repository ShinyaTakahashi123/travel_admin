/**
 * 法務の指摘。ceb2a9a1(輪島)の「總持寺祖院」の結びが「静かに、敬意をもって見学しましょう」と
 * なっているが、祈りの場についての決まった言い回し「今も祈りが続く場所ですので、静かに、
 * 敬意をもってお参りしましょう。」に合わせる。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const OLD_SENTENCE = "静かに、敬意をもって見学しましょう。";
const NEW_SENTENCE = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'ceb2a9a1%'`);
  const itinId = rows[0].id;
  const spot = await prisma.spot.findFirst({ where: { name: "總持寺祖院", day: { itineraryId: itinId } } });
  if (!spot) throw new Error("スポットが見つかりません");
  if (!spot.memo?.includes(OLD_SENTENCE)) throw new Error("想定の一文が見つかりません: " + spot.memo);
  if ((spot.memo.match(new RegExp(OLD_SENTENCE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length !== 1) {
    throw new Error("一文が複数箇所に一致しました");
  }
  const newMemo = spot.memo.replace(OLD_SENTENCE, NEW_SENTENCE);
  console.log("確認OK。id:", spot.id);
  console.log("旧:", spot.memo);
  console.log("新:", newMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: spot.id }, data: { memo: newMemo } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
