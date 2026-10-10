/**
 * #354の続き。itinerary-audit.cjsで検出した3点を修正。
 *
 * 1. 第一牧志公設市場の滞在(昼食)を60分にするつもりが、更新データにstayDurationMinを
 *    入れ忘れて元の63分のままになっていた。次の沖縄県立博物館・美術館への移動時間(10分)と
 *    合わなくなっていた(⚠時刻の計算が合わない)ため、60分に修正。
 * 2. 波の上ビーチ・波上宮の座標が、OSMの実POIからそれぞれ約490m・約565m離れていた
 *    (丸め/推定の値だったとみられる、#354の組み直しで初めて動かした既存データの座標)。
 *    実POIに修正: 波の上ビーチ=way 51392303(wikidata Q11555420)、
 *    波上宮=way 1337981786(「なんみんさん」、wikidata Q704636)。
 *    座標修正後、波上宮と波上護国寺(既存座標26.220068,127.671579、修正不要)は実際には
 *    約50mしか離れておらず、⚠徒歩が速すぎの指摘は座標修正で解消される(時間を他へ
 *    回したのではなく、座標の精度を直したことによる自然な解消)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354b-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";

const ICHIBA_ID = "ed3f3c5b-e3b9-4bec-a990-3a940449ff52";
const NAMINOUE_BEACH_ID = "1ae5b3e0-71a4-4bfb-9fb6-834a01e18120";
const NAMINOUE_GU_ID = "27dd882f-3ddc-4231-bd38-b21fd2e3c2a4";

async function main() {
  const ichiba = await prisma.spot.findUniqueOrThrow({ where: { id: ICHIBA_ID } });
  if (ichiba.stayDurationMin === 60) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: ICHIBA_ID }, data: { stayDurationMin: 60 } });
  await prisma.spot.update({
    where: { id: NAMINOUE_BEACH_ID },
    data: { lat: 26.2213152, lng: 127.6719804 },
  });
  await prisma.spot.update({
    where: { id: NAMINOUE_GU_ID },
    data: { lat: 26.2204073, lng: 127.6711916 },
  });
  // transitDurationMinは据え置き(5分): 座標修正後の実距離は波の上ビーチ→波上宮が約128m、
  // 波上宮→波上護国寺が約50mで、どちらも5分なら徒歩として十分な余裕があり、
  // 「速すぎ」の指摘は座標修正だけで解消される

  console.log("第一牧志公設市場を60分に、波の上ビーチ・波上宮の座標をOSM実POIに修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
