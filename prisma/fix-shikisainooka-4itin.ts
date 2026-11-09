/**
 * 四季彩の丘の点の直し(4本共通)。
 *
 * 今までの点(node5810723022、面のふちの頂点だが、運営の駐車場way369100655・中心
 * 43.529317,142.464359から約260m離れた反対側)を、駐車場に近い側のふちの頂点
 * node11821778316(43.529439,142.464054)に直す(7章の例外。名前のある入口・案内所が
 * ないため、車で着く側の、名前のある庭の面「四季彩の丘」way369100684のふちの点を使う。
 * 企画運営・法務のOK、2026-11-04)。
 *
 * 前後の車の分は、新しい点でOSRM routed-carで測り直した。8区間すべて、今の値が
 * 「実測以上・実測×1.5+5分以下」の範囲の中だったため、時刻・区間・本文は変更しない
 * (点だけの直し)。測り直した値(参考。実測+5分・切り上げ):
 * - 拓真館→四季彩(51cda3be): 実測4.4分→9分台。今の10分は範囲の中
 * - 四季彩→美瑛の丘パッチワークの路(51cda3be): 実測22.1分→27分台。今の28分は範囲の中
 * - 美瑛選果→四季彩(03330540): 実測8.7分→13分台。今の10分は範囲の中
 * - 四季彩→ふらのワイン工場(03330540): 実測23.0分→28分台。今の33分は範囲の中
 * - 白ひげの滝→四季彩(a99d53ff): 実測21.4分→26分台。今の28分は範囲の中
 * - 四季彩→ニングルテラス(a99d53ff): 実測27.2分→32分台。今の40分は範囲の中
 * - 丘のくら→四季彩(22c9a16c): 実測10.4分→15分台。今の16分は範囲の中
 * - 四季彩→新栄の丘展望公園(22c9a16c): 実測5.8分→10分台。今の12分は範囲の中
 *
 * 使い方: npm run prod -- npx tsx prisma/fix-shikisainooka-4itin.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const OLD_LAT = 43.528404;
const OLD_LNG = 142.467338;
const NEW_LAT = 43.529439;
const NEW_LNG = 142.464054;

const TARGETS = [
  { itineraryTitle: "花と丘の絶景を巡る、富良野・美瑛のフォトジェニック旅", spotId: "13577c2d-4cd3-4804-a5e9-9396cb565c5a" },
  { itineraryTitle: "白銀の青い池とニングルテラス、冬の富良野・美瑛を楽しむプラン", spotId: "d8f8c1ce-ca27-4bf9-b253-dcf2c819f351" },
  { itineraryTitle: "パッチワークの丘をレンタカーでドライブ、美瑛の絶景めぐり日帰り旅", spotId: "37db0381-d349-4844-af66-c3cb5cb168f1" },
  { itineraryTitle: "青い池とラベンダー畑、パッチワークの丘を巡る日帰りプラン", spotId: "163b256d-d919-4f96-bf11-c789d57480b9" },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const t of TARGETS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: t.spotId } });
    if (s.name !== "四季彩の丘") throw new Error(`${t.spotId}: 名前が四季彩の丘ではありません(${s.name})`);
    if (s.lat === null || s.lng === null) throw new Error(`${t.spotId}: 現在の点がnullです`);
    if (Math.abs(Number(s.lat) - OLD_LAT) > 0.00001 || Math.abs(Number(s.lng) - OLD_LNG) > 0.00001) {
      throw new Error(`${t.spotId}: 現在値が期待と不一致(現在 ${s.lat},${s.lng})`);
    }
    console.log(`\n[${t.itineraryTitle}]`);
    console.log(`  四季彩の丘(${t.spotId}): ${OLD_LAT},${OLD_LNG} → ${NEW_LAT},${NEW_LNG}`);
  }
  console.log("\n時刻・滞在・区間・本文は変えません(8区間とも範囲の中のため)。");

  if (!commit) {
    console.log("\n(確認モード。--commit で書き込みます)");
    return;
  }

  await prisma.$transaction(
    TARGETS.map((t) => prisma.spot.update({ where: { id: t.spotId }, data: { lat: NEW_LAT, lng: NEW_LNG } }))
  );
  console.log("\n書き込みました。");
}
main().finally(() => prisma.$disconnect());
