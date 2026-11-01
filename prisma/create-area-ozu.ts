/**
 * 「ほかにない地方のしおり」候補1番(大洲市、愛媛県)用の新しいエリア作成。
 * 公開しおりが3本そろうまで slug は null のまま(まとめページを作らない)。
 *
 * 実行方法:
 *   npx tsx prisma/create-area-ozu.ts            … 確認モード
 *   npx tsx prisma/create-area-ozu.ts --commit   … 登録モード
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const commit = process.argv.includes("--commit");
  const ehime = await prisma.area.findFirstOrThrow({ where: { name: "愛媛県", level: "prefecture" } });
  const existing = await prisma.area.findFirst({ where: { name: "大洲", level: "area", parentId: ehime.id } });
  if (existing) {
    console.log("すでに存在します:", existing);
    return;
  }
  const maxOrder = await prisma.area.aggregate({ where: { parentId: ehime.id }, _max: { displayOrder: true } });
  const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
  console.log(`作成予定: name=大洲 level=area parentId=${ehime.id} displayOrder=${displayOrder} slug=null(公開しおり3本がそろうまで)`);
  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }
  const created = await prisma.area.create({ data: { name: "大洲", level: "area", parentId: ehime.id, displayOrder } });
  console.log("[--commit] 作成しました:", created);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
