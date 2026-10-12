/**
 * #354の続き。prayer-check.cjsが「配慮の一文なし」として挙げた7件を1件ずつ確認。
 *
 * 追加が必要と判断した3件(実際に手を合わせる対象の、現役の礼拝地):
 * - 玉陵: 歴代王の陵墓(お墓)
 * - 識名宮・安里八幡宮: 今も参拝できる神社
 * に、敬意をもって見学・参拝する旨の一文を追加した。
 *
 * 誤検知と判断して変更しなかった4件(外から眺める遺構・史跡で、現在は礼拝の対象として
 * 立ち入るものではないため):
 * - 円覚寺跡(総門・放生橋のみ現存する遺構)
 * - 弁財天堂・円鑑池(天女橋越しに眺める、対岸からの見学が前提)
 * - 崇元寺石門(儀式が行われたのは往時の話で、現在は石門・石垣のみの史跡)
 * - 波上宮(既存文に「静かにお参りください」と既にあり、正規表現(敬意|手を合わせ)に
 *   一致しないだけの誤検知)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354c-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const TAMAUDUN_ID = "c24d3305-ef33-46e7-a64c-19f9ed0ae671";
const SHIKINAGU_NAME = "識名宮";
const ASATO_NAME = "安里八幡宮";

async function main() {
  const tamaudun = await prisma.spot.findUniqueOrThrow({ where: { id: TAMAUDUN_ID } });
  const old1 = "両方の価値が認められた貴重な文化財だということを覚えておいてください。";
  const new1 = "両方の価値が認められた貴重な文化財だということを覚えておいてください。歴代の王が眠るお墓でもあるので、静かに、敬意をもって見学しましょう。";
  if (tamaudun.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: TAMAUDUN_ID }, { memo: tamaudun.memo.replace(old1, new1) });
    console.log("玉陵: 敬意の一文を追加");
  } else {
    console.log("玉陵: 既に対応済み、スキップ");
  }

  const shikinagu = await prisma.spot.findFirstOrThrow({ where: { name: SHIKINAGU_NAME, day: { itineraryId: ITIN_ID } } });
  const old2 = "沖縄戦で社殿を焼失しましたが、1968年に復興されました。見学を終えたら、識名園へ向かいましょう。";
  const new2 = "沖縄戦で社殿を焼失しましたが、1968年に復興されました。静かに手を合わせましょう。見学を終えたら、識名園へ向かいましょう。";
  if (shikinagu.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shikinagu.id }, { memo: shikinagu.memo.replace(old2, new2) });
    console.log("識名宮: 敬意の一文を追加");
  } else {
    console.log("識名宮: 既に対応済み、スキップ");
  }

  const asato = await prisma.spot.findFirstOrThrow({ where: { name: ASATO_NAME, day: { itineraryId: ITIN_ID } } });
  const old3 = "数少ない神社でもあります。参拝を終えたら、少し落ち着いた雰囲気の崇元寺石門へ向かいましょう。";
  const new3 = "数少ない神社でもあります。静かに手を合わせましょう。参拝を終えたら、少し落ち着いた雰囲気の崇元寺石門へ向かいましょう。";
  if (asato.memo?.includes(old3)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: asato.id }, { memo: asato.memo.replace(old3, new3) });
    console.log("安里八幡宮: 敬意の一文を追加");
  } else {
    console.log("安里八幡宮: 既に対応済み、スキップ");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
