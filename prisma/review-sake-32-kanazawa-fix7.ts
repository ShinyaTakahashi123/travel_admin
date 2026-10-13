/**
 * #32の直し(企画運営の指摘、2026-10-13)。主計町茶屋街のメモの終わりに残っていた
 * 「ここからは、バスで福光屋へ向かいます」を、実際にバスで移動する区間
 * (泉鏡花記念館→福光屋)に合わせ、泉鏡花記念館のメモの終わりに移す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KAZUEMACHI_SPOT_ID = "13594a40-ac48-4456-a93f-c8eb18f357cd";
const BUS_NOTE = "ここからは、バスで福光屋へ向かいます(約20分)。";

async function main() {
  const kazuemachi = await prisma.spot.findUnique({ where: { id: KAZUEMACHI_SPOT_ID } });
  const kyoka = await prisma.spot.findFirst({ where: { name: "泉鏡花記念館" } });
  if (!kazuemachi?.memo || !kyoka?.memo) throw new Error("想定と違います");
  if (!kazuemachi.memo.includes(BUS_NOTE)) throw new Error("主計町茶屋街の置換対象が見つかりません");
  if (kyoka.memo.includes(BUS_NOTE)) throw new Error("泉鏡花記念館に既にバスの一文があります(想定外)");

  const newKazuemachiMemo = kazuemachi.memo.replace(BUS_NOTE, "");
  const newKyokaMemo = kyoka.memo + BUS_NOTE;

  console.log("[確認OK] 主計町茶屋街からバスの一文を削除");
  console.log("[確認OK] 泉鏡花記念館にバスの一文を追加");
  console.log("新主計町茶屋街メモ:", newKazuemachiMemo);
  console.log("新泉鏡花記念館メモ:", newKyokaMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: KAZUEMACHI_SPOT_ID }, data: { memo: newKazuemachiMemo } });
  await prisma.spot.update({ where: { id: kyoka.id }, data: { memo: newKyokaMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
