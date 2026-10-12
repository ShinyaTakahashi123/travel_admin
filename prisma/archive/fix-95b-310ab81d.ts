/**
 * #95 310ab81d fix-95の直後の直し。既存の`seasons`が{summer}のままだった。
 * 今回追加したスポット(灯台・展望台・博物館・道の駅・庭園)はいずれも通年
 * 楽しめる内容で、アカウミガメ(5〜8月)・竜宮まつり(8/15)はメモ内の一部の
 * 話にすぎず、旅全体を夏限定にする理由はない。全季節に直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, seasons from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;
  console.log("現在のseasons:", rows[0].seasons);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: itinId }, data: { seasons: ["spring", "summer", "autumn", "winter"] } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
