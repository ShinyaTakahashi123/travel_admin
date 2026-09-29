/** #376 d6c081e8 法務の指摘: 飫肥城下町の「九州で初めて」を伝聞の形に（しおりえ(制作補助2)）。使い方: npm run prod -- npx tsx prisma/fix-376b-d6c081e8.ts [--commit] */
import { prisma } from "../src/lib/prisma";
const ITINERARY_ID = "d6c081e8-2895-4363-ac7a-1fa21aababf5";
const A = "1977年には、九州で初めて国の重要伝統的建造物群保存地区に選ばれています。";
const B = "1977年には、九州で初めて国の重要伝統的建造物群保存地区に選ばれたとされています。";
async function main() {
  const sp = await prisma.spot.findFirstOrThrow({ where: { name: "飫肥城下町", day: { itineraryId: ITINERARY_ID } } });
  if (!sp.memo?.includes(A)) throw new Error("対象の文が見つかりません");
  console.log(`${sp.id}\n前: ${A}\n後: ${B}`);
  if (!process.argv.includes("--commit")) return console.log("確認モード");
  await prisma.spot.update({ where: { id: sp.id }, data: { memo: sp.memo.replace(A, B) } });
  console.log("書き込みました。");
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());
