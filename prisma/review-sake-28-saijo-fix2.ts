/**
 * #28の直し。説明文の見落としに対応。
 * - 「有料の場合があり」はお金の話なので削除
 * - 「確かめてください」は「確かめましょう」に直す(決まりの例外は祈りの一文のみ)
 * - 蔵元の列挙に、今回追加した福美人酒造を加える
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "5429383d-560c-47c2-9413-4188ed09c34e";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin?.description) throw new Error("想定と違います");

  const newDesc = itin.description
    .replace("白牡丹・賀茂鶴・賀茂泉の蔵元", "白牡丹・賀茂鶴・福美人・賀茂泉の蔵元")
    .replace(
      "見学や試飲は、予約が必要な場合や有料の場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめてください。",
      "見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。"
    );
  if (newDesc === itin.description) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 説明文のお金の話・「ください」を直し、福美人酒造を追加");
  console.log("新説明文:", newDesc);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDesc } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
