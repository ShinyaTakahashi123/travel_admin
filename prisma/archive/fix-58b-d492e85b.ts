/**
 * #58 d492e85b（高山）法務の指摘(2026-09-30 11:52): 説明文の「全国で唯一現存する
 * 陣屋建築」を、本文(高山陣屋)と同じ言い切り回避の書き方「...とされる」に合わせる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "d492e85b-d2a7-4d8f-b9cd-1e76a2c60a19";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN } });
  const from = "全国で唯一現存する陣屋建築";
  const to = "全国で唯一現存するとされる陣屋建築";
  if (!it.description!.includes(from)) throw new Error("一致しません(説明文)");
  const newDesc = it.description!.split(from).join(to);
  console.log("説明文 現在:", it.description);
  console.log("説明文 新規:", newDesc);

  const jinya = await findSpotInItinerary(ITIN, { spotName: "高山陣屋" });
  const jinyaFrom = "どうぞじっくりとご覧ください。";
  const jinyaTo = "じっくり見てみてください。";
  if (!jinya.memo!.includes(jinyaFrom)) throw new Error("一致しません(高山陣屋)");
  const newJinyaMemo = jinya.memo!.split(jinyaFrom).join(jinyaTo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITIN }, data: { description: newDesc } });
  await updateSpotInItinerary(ITIN, { spotId: jinya.id }, { memo: newJinyaMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
