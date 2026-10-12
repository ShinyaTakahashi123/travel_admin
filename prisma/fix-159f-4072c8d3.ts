/**
 * #159の続き。企画運営の指摘(金剛峯寺の蟠龍庭の一文が15c4b54aとまだ71%
 * 近い)に対応。「日本最大級」「雲海の中で雌雄一対の龍が奥殿を守る姿」を
 * 外し、15c4b54aが書いていない広さ・石や砂の産地(出典: WebSearchで確認)
 * に置き換えた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-159f-4072c8d3.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "6d957fc9-237e-44e8-aa16-0c2ca9def561";

async function main() {
  const kongobuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "金剛峯寺" } });

  const oldSentence =
    "境内には、昭和59年(1984)に造園された、石庭としては国内有数の広さともいわれる「蟠龍庭」もあり、雲海の中で雌雄一対の龍が奥殿を守る姿が表現されています。";
  if (!kongobuji.memo?.includes(oldSentence)) {
    console.log("already applied, skipping");
    return;
  }

  const newSentence =
    "境内には、弘法大師御入定1150年御遠忌を記念して昭和59年(1984)に造られた石庭「蟠龍庭」もあります。広さはおよそ1650平方メートルにおよび、龍を表す石組みには四国産の花崗岩が、雲海を表す白砂には京都産のものが使われています。";

  await prisma.spot.update({
    where: { id: kongobuji.id },
    data: { memo: kongobuji.memo.replace(oldSentence, newSentence) },
  });

  console.log("#159続き: 蟠龍庭の一文を、15c4b54aと重ならない広さ・産地の話に差し替え");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
