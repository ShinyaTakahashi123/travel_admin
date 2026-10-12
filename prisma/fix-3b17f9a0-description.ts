/**
 * 法務の確認で見つかった食い違いの修正(企画運営からの依頼)。
 * 3b17f9a0(奥入瀬渓流を歩き、十和田湖の紅葉に出会う旅)の説明文は
 * 「2日目は遊覧船で湖上から紅葉を眺める」だが、「十和田湖遊覧船（子ノ口発）」は
 * day1の最後のスポット。スポットは変えず、説明文の日の書き方だけを直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FROM = "渓流沿いの遊歩道を歩いて奥入瀬の滝や急流をめぐり、十和田湖畔に宿泊。2日目は遊覧船で湖上から紅葉を眺める1泊2日プランです。例年の見頃は10月中旬〜下旬。バスと徒歩を組み合わせて、見どころを効率よくめぐります。";
const TO = "渓流沿いの遊歩道を歩いて奥入瀬の滝や急流をめぐり、遊覧船で湖上から紅葉を眺めて十和田湖畔に宿泊。2日目は展望台などをめぐる1泊2日プランです。例年の見頃は10月中旬〜下旬。バスと徒歩を組み合わせて、見どころを効率よくめぐります。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3b17f9a0%'`);
  const itinId = rows[0].id;
  const it = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { description: true } });
  if (it!.description !== FROM) throw new Error("説明文が想定外です: " + it!.description);
  console.log("確認OK。");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { description: TO } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
