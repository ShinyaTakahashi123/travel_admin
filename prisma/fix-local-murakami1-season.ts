/**
 * 村上(地方のしおり候補4)の季節をspringのみに設定(企画運営の決定: 人形さま巡りは春の行事のため)。
 * 使い方: npm run prod -- npx tsx prisma/fix-local-murakami1-season.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "城下町村上、町屋の人形さま巡りと鮭の文化をめぐる日帰りプラン";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  console.log("季節:", it.seasons, "→", ["spring"]);
  if (commit) {
    await prisma.itinerary.update({ where: { id: it.id }, data: { seasons: ["spring"] } });
    console.log("書き込みました。");
  } else {
    console.log("(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());
