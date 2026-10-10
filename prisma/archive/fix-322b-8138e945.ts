/**
 * #322の続き(自己チェックの気づき)。
 * 1. 堺市博物館の「無料ゾーンには」が金銭の記載(決まり)に触れていたため
 *    「無料」を外した(itinerary-audit検出)。
 * 2. prayer-check.cjsの判定語(「敬意」「手を合わせ」)に「静かに」だけでは
 *    合致しないため、名前に「陵」「寺」を含む4か所(仁徳天皇陵古墳・
 *    履中天皇陵古墳・南宗寺・妙国寺)に「敬意」を含む一文を追加・調整した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-322b-8138e945.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8138e945-07a7-491e-8239-3422405ebb78";

async function main() {
  const hakubutsukan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "堺市博物館" },
  });
  {
    const old = "無料ゾーンには「百舌鳥古墳群シアター」があり、";
    const next = "館内には「百舌鳥古墳群シアター」があり、";
    if (hakubutsukan.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: hakubutsukan.id }, { memo: hakubutsukan.memo.replace(old, next) });
    }
  }

  const nintoku = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "仁徳天皇陵古墳（大仙古墳）" },
  });
  {
    const old = "広大な周濠沿いをゆっくり歩いて、まずは古代へ思いを馳せてみてください。";
    const next = "広大な周濠沿いを、静かに、敬意をもって歩き、まずは古代へ思いを馳せてみましょう。";
    if (nintoku.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: nintoku.id }, { memo: nintoku.memo.replace(old, next) });
    }
  }

  const richu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "履中天皇陵古墳" },
  });
  {
    const old = "静かに、周濠沿いの散策を楽しみましょう。";
    const next = "静かに、敬意をもって、周濠沿いの散策を楽しみましょう。";
    if (richu.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: richu.id }, { memo: richu.memo.replace(old, next) });
    }
  }

  const nanshuji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "南宗寺" },
  });
  {
    const old = "利休ゆかりの静かな空間を味わったら、次はその利休をテーマにした文化施設、さかい利晶の杜へ向かいましょう。";
    const next =
      "境内には、静かに、敬意をもってお参りしましょう。利休ゆかりの静かな空間を味わったら、次はその利休をテーマにした文化施設、さかい利晶の杜へ向かいましょう。";
    if (nanshuji.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: nanshuji.id }, { memo: nanshuji.memo.replace(old, next) });
    }
  }

  const myokokuji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "妙国寺" },
  });
  {
    const old = "静かに境内を眺めてみましょう。";
    const next = "静かに、敬意をもって境内を眺めてみましょう。";
    if (myokokuji.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: myokokuji.id }, { memo: myokokuji.memo.replace(old, next) });
    }
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const newDesc =
    "仁徳天皇陵古墳・履中天皇陵古墳をはじめとする世界遺産の古墳群、千利休ゆかりの南宗寺、伝統の堺打刃物まで。古代から続く「堺」の歴史を定番スポットで辿ります。";
  if (itin.description !== newDesc) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDesc } });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
