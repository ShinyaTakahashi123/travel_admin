/**
 * #68(天橋立と伊根の舟屋、海と絶景の丹後めぐり旅、c5aee4db)の、法務が
 * 本番で見つけた4点の座標と4点の言葉づかいを直す(fix-68-c5aee4db.tsの
 * あとの2回目の直し。天橋立の座標はすでに前回で直したので対象外)。
 *
 * 【座標(7章)】
 * ① 伊根の舟屋(Day1): 民宿「伊根の舟屋 雅」(way958880696、tourism=
 *    guest_house)の建物の上だった。名前のある展望所「舟屋群展望所」
 *    (node3693807452、tourism=viewpoint)の35.6744372/135.2910172に直す。
 * ② 成相寺(Day2): OSMの点ではない場所だった。way683933400「成相寺」
 *    (amenity=place_of_worship)のNominatim値35.594973/135.187819に直す。
 * ③ 旧加悦鉄道加悦駅舎(Day2): 案内板(node6919501520)の点だった。施設
 *    そのものway829619234「旧加悦鉄道加悦駅舎」(tourism=museum)の
 *    Nominatim値35.504097/135.09475に直す。
 * ④ ちりめん街道(Day2): 宝巌寺(way830182389)の点だった(7mの差)。同じ
 *    名前の案内板node6919601376「ちりめん街道」の35.5035949/135.0920876
 *    に直す。
 *
 * 【言葉づかい(「〜てみてください」を使わない決まり)】
 * ⑤ 天橋立(Day2)「ここで昼食にするのもおすすめです。」→「ここで昼食に
 *    しましょう。」
 * ⑥ 智恩寺(Day1)「あわせて眺めてみてください。」→「あわせて眺め
 *    ましょう。」
 * ⑦ 旧加悦鉄道加悦駅舎(Day2)「丹後の鉄道の歴史をたどってみてください。」
 *    →「…をたどりましょう。」
 * ⑧ ちりめん街道(Day2)「のんびりと歩いてみてください。」→「のんびりと
 *    歩きましょう。」
 *
 * 時刻・順番・滞在は変更しない(前回の直しのまま)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-68-c5aee4db-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-68-c5aee4db-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const INE_ID = "5cc71901-3648-4dfc-b001-23ff64deda5b"; // 伊根の舟屋
const NARIAIJI_ID = "80d3d20f-0c11-4cd5-bde7-58ad874c152d"; // 成相寺
const KAYAEKI_ID = "70935df8-9d82-404e-9690-d459c77001db"; // 旧加悦鉄道加悦駅舎
const CHIRIMEN_ID = "4284a322-8ec2-4172-9d3c-a3215b06ef2b"; // ちりめん街道
const TENKYOUDATE_ID = "1df469c2-1941-4ff0-a7a9-199a5069fc79"; // 天橋立
const CHIONJI_ID = "62791fec-4404-4eab-ad48-dd36c06f2cba"; // 智恩寺

const TENKYOUDATE_FIND = "ここで昼食にするのもおすすめです。";
const TENKYOUDATE_REPLACE = "ここで昼食にしましょう。";

const CHIONJI_FIND = "あわせて眺めてみてください。";
const CHIONJI_REPLACE = "あわせて眺めましょう。";

const KAYAEKI_FIND = "丹後の鉄道の歴史をたどってみてください。";
const KAYAEKI_REPLACE = "丹後の鉄道の歴史をたどりましょう。";

const CHIRIMEN_FIND = "のんびりと歩いてみてください。";
const CHIRIMEN_REPLACE = "のんびりと歩きましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [ine, nariaiji, kayaeki, chirimen, tenkyoudate, chionji] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: INE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NARIAIJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KAYAEKI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CHIRIMEN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TENKYOUDATE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CHIONJI_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["天橋立", tenkyoudate, TENKYOUDATE_FIND],
    ["智恩寺", chionji, CHIONJI_FIND],
    ["旧加悦鉄道加悦駅舎", kayaeki, KAYAEKI_FIND],
    ["ちりめん街道", chirimen, CHIRIMEN_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newTenkyoudateMemo = tenkyoudate.memo!.replace(TENKYOUDATE_FIND, TENKYOUDATE_REPLACE);
  const newChionjiMemo = chionji.memo!.replace(CHIONJI_FIND, CHIONJI_REPLACE);
  const newKayaekiMemo = kayaeki.memo!.replace(KAYAEKI_FIND, KAYAEKI_REPLACE);
  const newChirimenMemo = chirimen.memo!.replace(CHIRIMEN_FIND, CHIRIMEN_REPLACE);

  console.log("=== #68 法務の指摘(2回目)直す前→直した後 ===\n");
  console.log(`[伊根の舟屋] (id=${ine.id}) — 座標のみ`);
  console.log("  旧lat/lng:", ine.lat, ine.lng, " → 新lat/lng: 35.6744372 / 135.2910172 (OSM 舟屋群展望所 node3693807452)");
  console.log("");
  console.log(`[成相寺] (id=${nariaiji.id}) — 座標のみ`);
  console.log("  旧lat/lng:", nariaiji.lat, nariaiji.lng, " → 新lat/lng: 35.594973 / 135.187819 (OSM Nominatim way683933400)");
  console.log("");
  console.log(`[旧加悦鉄道加悦駅舎] (id=${kayaeki.id}) — 座標・本文`);
  console.log("  旧lat/lng:", kayaeki.lat, kayaeki.lng, " → 新lat/lng: 35.504097 / 135.09475 (OSM Nominatim way829619234)");
  console.log("  新memo:", newKayaekiMemo);
  console.log("");
  console.log(`[ちりめん街道] (id=${chirimen.id}) — 座標・本文`);
  console.log("  旧lat/lng:", chirimen.lat, chirimen.lng, " → 新lat/lng: 35.5035949 / 135.0920876 (OSM node6919601376「ちりめん街道」)");
  console.log("  新memo:", newChirimenMemo);
  console.log("");
  console.log(`[天橋立] (id=${tenkyoudate.id}) — 本文のみ`);
  console.log("  新memo:", newTenkyoudateMemo);
  console.log("");
  console.log(`[智恩寺] (id=${chionji.id}) — 本文のみ`);
  console.log("  新memo:", newChionjiMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: INE_ID }, data: { lat: 35.6744372, lng: 135.2910172 } });
  await prisma.spot.update({ where: { id: NARIAIJI_ID }, data: { lat: 35.594973, lng: 135.187819 } });
  await prisma.spot.update({ where: { id: KAYAEKI_ID }, data: { lat: 35.504097, lng: 135.09475, memo: newKayaekiMemo } });
  await prisma.spot.update({ where: { id: CHIRIMEN_ID }, data: { lat: 35.5035949, lng: 135.0920876, memo: newChirimenMemo } });
  await prisma.spot.update({ where: { id: TENKYOUDATE_ID }, data: { memo: newTenkyoudateMemo } });
  await prisma.spot.update({ where: { id: CHIONJI_ID }, data: { memo: newChionjiMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
