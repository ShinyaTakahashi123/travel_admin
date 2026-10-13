/**
 * #35の直し(自己点検)。説明文に肥前浜宿酒蔵通りへの立ち寄りが反映されていな
 * かったため追加。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "79fc6e71-05b8-4b68-af91-e5c333fc7f1b";

const OLD_DESC =
  "「日本三大稲荷」の一つに数えられるという祐徳稲荷神社を中心に、四季の花が咲く日本庭園、有明海を見渡す奥の院、門前の表参道までをめぐる、鹿島の日帰りプランです。";

const NEW_DESC =
  "日本三大稲荷の一つとされる祐徳稲荷神社を中心に、四季の花が咲く日本庭園、有明海を見渡す奥の院、門前の表参道から、バスで立ち寄る肥前浜宿酒蔵通りまでをめぐる、鹿島の日帰りプランです。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("想定と違います");

  console.log("[確認OK] 説明文に肥前浜宿酒蔵通りを追加、「日本三大稲荷」の言い切りもぼかす");
  console.log("新説明文:", NEW_DESC);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
