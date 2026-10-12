/**
 * #157の続き。確認ツールの指摘に対応。
 * ①水間寺に敬意の一文がなかったため追加(prayer-check)。
 * ②りんくうプレミアム・アウトレットの「旅の締めくくりに訪れたいのが」は、
 *   関空展望ホール スカイビューを追加して最後のスポットでなくなったため
 *   削除(flow-checkの「途中に結び」)。
 * ③同アウトレットの「「西日本最大」ともうたわれる規模」は、ヘッジの言葉が
 *   同一文の中になかったため「ともいわれる」に修正(itinerary-auditの
 *   「言い切り?」)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-157b-3441e3a7.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "f31b13cc-c09e-41cc-8ad9-67ac4bc563d0";

async function main() {
  const mizuma = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "水間寺" } });
  const outlet = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "りんくうプレミアム・アウトレット" } });

  if (!mizuma.memo?.includes("縁結びを願う参拝者の姿も見られます。厳かな")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: mizuma.id },
    data: {
      memo: mizuma.memo.replace(
        "縁結びを願う参拝者の姿も見られます。厳かな空気を味わったら、",
        "縁結びを願う参拝者の姿も見られます。静かに、敬意をもってお参りしましょう。厳かな空気を味わったら、"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: outlet.id },
    data: {
      memo: outlet.memo
        ?.replace(
          "りんくう公園から歩いてすぐ、旅の締めくくりに訪れたいのが、大きな観覧車が目印のりんくうプレミアム・アウトレットです。",
          "りんくう公園から歩いてすぐ、次に訪れるのは、大きな観覧車が目印のりんくうプレミアム・アウトレットです。"
        )
        .replace("「西日本最大」ともうたわれる規模", "「西日本最大」ともいわれる規模"),
    },
  });

  console.log("#157続き: 水間寺に敬意の一文を追加、アウトレットの結びとヘッジの言葉を修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
