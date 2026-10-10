/**
 * #325の続き。企画運営2026-10-01 01:51の3点。
 * 1) たらい舟(小木港)の座標: 前回のGSI住所検索の点は大字(小木町)の
 *    中心で不正確だった。OSMの生API(api.openstreetmap.org/api/0.6/map?
 *    bbox=...)で小木港周辺を取得したところ、「たらい舟力屋観光汽船」と
 *    名前のついた建物(way 682931421)が見つかり、その4つの角の平均から
 *    中心点37.81466,138.27958を算出した。乗り場の建物そのものの座標
 *    のため、これを採用した。
 * 2) 朝のつじつま: 両津港でレンタカーを借りて小木まで車で約1時間
 *    かかるため、新潟からの朝一番の船では9:30に間に合わない可能性が
 *    あった。本文を「前の晩は佐渡に泊まり、朝、両津港の近くでレンタカーを
 *    借りて」に直し、前泊を前提とする形にした(船の時刻は本文に書いて
 *    いない)。
 * 3) 妙宣寺の「新潟県内唯一の五重塔」は、確認したところ既に
 *    「現存する新潟県内唯一の五重塔とされています。」とヘッジ済み
 *    だったため、変更なし。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-325c-881f9752.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "881f9752-bf82-464c-b6b7-0ff8e038f904";

async function main() {
  const tarai = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "たらい舟（小木港）" },
  });

  const old = "佐渡へは、新潟港から両津港までカーフェリーやジェットフォイルで渡ります。両津港でレンタカーを借りて、南の小木エリアまで足を延ばしましょう。";
  const next = "佐渡へは、前の晩に渡って一泊し、朝、両津港の近くでレンタカーを借りて、南の小木エリアまで足を延ばしましょう。";
  const memo = (tarai.memo ?? "").includes(old) ? tarai.memo!.replace(old, next) : tarai.memo;

  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: tarai.id },
    { memo, lat: 37.81466, lng: 138.27958 }
  );

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
