/**
 * #368の続き。企画運営の指摘2点に対応。
 *
 * 1. 季節: 投入堂参拝登山は、積雪のため冬(例年12月〜3月頃)は入山禁止になる
 *    ことを公式サイト(https://mitokusan.jp/)で確認した。本文の文言:
 *    「雨や雪などにより、当山が危険と判断した場合は入山禁止になります。
 *    （例年ですと冬の間、１２月～３月ぐらいまでは積雪の為入山禁止になって
 *    おります）」。seasons から winter を外し、本文の天候の一文を
 *    冬を明記したものに直した。
 * 2. 説明文: 「日本一危険な国宝とも言われる投入堂」の「危険」を売りにする
 *    言い方を外し、「断崖の窪みに建てられた国宝・投入堂」に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-368c-ce55cb0f.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "ccb88c35-5eb7-4b59-ad40-9cb05a19cf7e";
const ITIN_ID = "ce55cb0f-9bec-4d98-9f46-f05f48e90be1";

async function main() {
  const itin = await prisma.itinerary.findFirstOrThrow({ where: { id: ITIN_ID } });
  if (!itin.seasons.includes("winter")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      seasons: itin.seasons.filter((s) => s !== "winter"),
      description:
        "断崖の窪みに建てられた国宝・投入堂。修験道の聖地・三徳山三佛寺で参拝登山を楽しんだあとは、三朝温泉や倉吉の白壁土蔵群も訪ね歩くプランです。",
    },
  });

  const sanbutsuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三徳山三佛寺（投入堂）" } });
  const oldText = "雨や雪など天候の悪い日は、入山できないことがあります。";
  const newText = "雨の日や、雪が積もる冬は、入山できないことがあります。";
  if (sanbutsuji.memo?.includes(oldText)) {
    await prisma.spot.update({
      where: { id: sanbutsuji.id },
      data: { memo: sanbutsuji.memo.replace(oldText, newText) },
    });
  }

  console.log("#368続き: 冬をseasonsから外し、本文の天候の一文を直し、説明文の「危険」を外した");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
