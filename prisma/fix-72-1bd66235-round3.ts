/**
 * #72(浦富海岸、山陰のリアス海岸を遊覧船で巡る1泊2日、1bd66235)の、法務が
 * 全点確認で見つけた2点の座標を直す(round2のあとの3回目の直し)。
 *
 * ① 山陰松島遊覧(35.578083,134.287964): 名前のない桟橋(way589693715)の
 *    近くの点だった。遊覧船が出る港way588201781「網代新港」のNominatim値
 *    35.5794815/134.2881967に直す(約150mの差)。
 * ② 城原海岸(35.591042,134.309402): 県道の線の上の点で、OSM・地理院にも
 *    「城原海岸」の点がなかった。7章の手順どおり、300m以内の名前のある
 *    地物(集落「田後」node6324233953、約235m)35.5907166/134.3119649に
 *    直す(企画運営の判断)。
 *
 * あわせて、鳥取砂丘の「素足やサンダルではなく、靴と靴下で歩くように
 * してください。」を「…歩きましょう。」に直す(法務の提案)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-72-1bd66235-round3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-72-1bd66235-round3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const CRUISE_ID = "da0ea19d-5ccf-4224-a871-bb429ca664b4"; // 山陰松島遊覧
const SHIROHARA_ID = "95e07ea9-9dfd-4fa7-a69e-44f398c7c8d3"; // 城原海岸
const SAKYU_ID = "f9cb3c08-035b-4d66-a604-494ff75efb31"; // 鳥取砂丘

const SAKYU_FIND = "素足やサンダルではなく、靴と靴下で歩くようにしてください。";
const SAKYU_REPLACE = "素足やサンダルではなく、靴と靴下で歩きましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [cruise, shirohara, sakyu] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: CRUISE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHIROHARA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SAKYU_ID } }),
  ]);

  if (!sakyu.memo?.includes(SAKYU_FIND)) {
    console.log(`[想定と違います] 鳥取砂丘に「${SAKYU_FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  const newSakyuMemo = sakyu.memo!.replace(SAKYU_FIND, SAKYU_REPLACE);

  console.log(`[山陰松島遊覧] (id=${cruise.id})`);
  console.log("  旧lat/lng:", cruise.lat, cruise.lng, " → 新lat/lng: 35.5794815 / 134.2881967 (OSM Nominatim way588201781「網代新港」)");
  console.log(`[城原海岸] (id=${shirohara.id})`);
  console.log("  旧lat/lng:", shirohara.lat, shirohara.lng, " → 新lat/lng: 35.5907166 / 134.3119649 (OSM node6324233953「田後」、約235m)");
  console.log(`[鳥取砂丘] (id=${sakyu.id}) — 言葉づかいのみ`);
  console.log("  新memo:", newSakyuMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: CRUISE_ID }, data: { lat: 35.5794815, lng: 134.2881967 } });
  await prisma.spot.update({ where: { id: SHIROHARA_ID }, data: { lat: 35.5907166, lng: 134.3119649 } });
  await prisma.spot.update({ where: { id: SAKYU_ID }, data: { memo: newSakyuMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
