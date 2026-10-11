/**
 * #224 de637e2a の金櫻神社の本文の直し（しおりえ(制作補助2)、企画運営の確認 10/11）
 * 出典 https://www.yamanashi-kankou.jp/rekitabi/jisha/spot/016.html で「甲府市の天然記念物に指定されています」は写真の説明文で、どの写真（木）かが書かれていないので、
 *   「甲府市の」を外して「天然記念物に指定されている」とだけ書く
 * 「古くから」は出典にないので外す。同じページの写真の説明文「左甚五郎作は焼失し、堀友二作が奉納されています」に合わせ、「昇・降龍」の書き方を直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-224c-de637e2a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "de637e2a-f51b-41e1-a874-69fde15d5972";
const COMMIT = process.argv.includes("--commit");
const EDITS = [
  { from: "御神木の鬱金の桜は甲府市の天然記念物で、", to: "御神木の鬱金の桜は天然記念物に指定され、" },
  { from: "として古くから崇められてきました。", to: "として崇められています。" },
  { from: "本殿には、左甚五郎の作と伝わる「昇・降龍」が復元されています。", to: "本殿の「昇・降龍」は、左甚五郎の作と伝わるものが失われ、今は別の彫刻家の作品が納められています。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { name: "金櫻神社", day: { itineraryId: ITINERARY_ID } } });
  if (spots.length !== 1) throw new Error("構成が想定と違います");
  let memo = spots[0].memo ?? "";
  for (const e of EDITS) {
    if (!memo.includes(e.from)) throw new Error(`本文が想定と違います: ${e.from}`);
    memo = memo.replace(e.from, e.to);
  }
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: spots[0].id }, data: { memo } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
