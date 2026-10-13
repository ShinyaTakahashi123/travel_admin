/**
 * #21の直し直し(自己点検)。fix2で移動時間を車10分に直した際、到着時刻を
 * 15:45+10分=15:55とすべきところを16:05と誤って計算していた
 * (10分の空白ができていた)。15:55に訂正する(終わりは16:35)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const todai = await prisma.spot.findFirst({ where: { name: "室戸岬灯台" } });
  if (!todai) throw new Error("想定と違います");
  const current = new Date(todai.visitTime!).toISOString().slice(11, 16);
  if (current !== "16:05") throw new Error("想定と違う現在時刻: " + current);

  console.log("[確認OK] 室戸岬灯台の到着時刻を16:05→15:55に訂正(終わり16:35)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: todai.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 55)) } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
