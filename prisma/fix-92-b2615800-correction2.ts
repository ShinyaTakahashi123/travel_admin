/**
 * #92 千葉1泊2日の訂正その2。法務が本番で全12か所を確認して見つけた座標の指摘を直す。
 *
 * - 千葉ポートタワー: バス停の点 → 塔そのもののway604291866のNominatim(35.6004224,140.0978591)
 * - 千葉ポートパーク: 自転車貸出の点 → 公園のway23991750のNominatim(35.5992483,140.0993372)
 * - 千葉県立美術館: 自転車貸出の点 → 美術館のway23991653のNominatim(35.6012195,140.1011459)
 * - 幕張海浜公園: バス停「マリンルート入口」(名前も公園と別) → 公園内の日本庭園「見浜園」
 *   (35.641941,140.038259、メモの内容にも合う名前の地物)
 * - 稲毛海浜公園: 約80haの公園のwayの中心 → メモに出てくる稲毛記念館(35.619861,140.060793)
 *
 * 座標を動かした区間の移動を実測し直す。入口(JR稲毛海岸駅)→稲毛記念館は実測3.1分(変更前の
 * 4分から3分に)。稲毛記念館→検見川の浜は実測2.8分(もとの3分のまま)。イオンモール→見浜園は
 * 実測3.2分(もとの8分=実測+駐車5分のまま変更なし)。見浜園→アウトレットは実測13.0分
 * (もとの10分から13分に、徒歩)。この差を、アウトレットの滞在を61分(63分から2分短縮)で
 * 吸収し、終了を17:00に保つ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-92-b2615800-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-92-b2615800-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const PORT_TOWER_ID = "60d63e2f-8d73-48bd-a52d-4cbc30bbd1f4";
const PORT_PARK_ID = "2b0e6a8d-de55-4e20-867e-9c10529d6903";
const ART_MUSEUM_ID = "dac52c77-3b20-4d54-8c7e-aaa451b89b2b";
const MAKUHARI_PARK_ID = "f901a22c-4260-444d-94ad-ee1ddc623513";
const INAGE_ID = "dcd8b609-88fd-4bc0-a45f-46dc9f2b9afa";
const KEMIGAWA_ID = "d934fd85-61f9-4a34-8600-6e0ce0608ccb";
const AEON_ID = "9d2dde3a-accf-47e0-ac2f-fb4396578a8f";
const OUTLET_ID = "a017bce3-7ebe-49ee-b2cc-c6a231b51113";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const INAGE_FIND = "車でおよそ4分の稲毛海浜公園から始まります。";
const INAGE_REPLACE = "車でおよそ3分の稲毛海浜公園から始まります。";
const INAGE_FIND2 = "この後は、車でおよそ3分、検見川の浜へ向かいましょう。";

const MAKUHARI_FIND = "この後は、歩いておよそ10分、三井アウトレットパーク幕張へ向かいましょう(車はこちらに置いたままで大丈夫です)。";
const MAKUHARI_REPLACE = "この後は、歩いておよそ13分、三井アウトレットパーク幕張へ向かいましょう(車はこちらに置いたままで大丈夫です)。";

const OUTLET_FIND = "幕張海浜公園から歩いておよそ10分、三井アウトレットパーク幕張に着きます。";
const OUTLET_REPLACE = "幕張海浜公園から歩いておよそ13分、三井アウトレットパーク幕張に着きます。";
const OUTLET_FIND2 = "幕張海浜公園の駐車場に置いた車に戻り(歩いて約10分)、車で宿へ向かいましょう。";
const OUTLET_REPLACE2 = "幕張海浜公園の駐車場に置いた車に戻り(歩いて約13分)、車で宿へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [inage, makuhariPark, outlet] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: INAGE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MAKUHARI_PARK_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: OUTLET_ID } }),
  ]);

  for (const [label, text, find] of [
    ["稲毛海浜公園", inage.memo ?? "", INAGE_FIND],
    ["稲毛海浜公園(2)", inage.memo ?? "", INAGE_FIND2],
    ["幕張海浜公園", makuhariPark.memo ?? "", MAKUHARI_FIND],
    ["アウトレット", outlet.memo ?? "", OUTLET_FIND],
    ["アウトレット(2)", outlet.memo ?? "", OUTLET_FIND2],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newInageMemo = inage.memo!.replace(INAGE_FIND, INAGE_REPLACE);
  const newMakuhariMemo = makuhariPark.memo!.replace(MAKUHARI_FIND, MAKUHARI_REPLACE);
  const newOutletMemo = outlet.memo!.replace(OUTLET_FIND, OUTLET_REPLACE).replace(OUTLET_FIND2, OUTLET_REPLACE2);

  console.log("=== #92 訂正その2: 座標の直し ===\n");
  console.log("千葉ポートタワー: 35.6004224,140.0978591(塔そのもの)");
  console.log("千葉ポートパーク: 35.5992483,140.0993372(公園のway)");
  console.log("千葉県立美術館: 35.6012195,140.1011459(美術館のway)");
  console.log("幕張海浜公園: 35.641941,140.038259(見浜園)");
  console.log("稲毛海浜公園: 35.619861,140.060793(稲毛記念館)");
  console.log("\n--- 移動・時刻の連動 ---");
  console.log("1. 稲毛海浜公園 10:48(80分、入口3分に): ", newInageMemo.slice(0, 60));
  console.log("4. 幕張海浜公園 14:36(70分、変更なし):", newMakuhariMemo.slice(-60));
  console.log("5. 三井アウトレットパーク幕張(最後) 15:59(61分←63分、終了17:00):", newOutletMemo.slice(-80));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: PORT_TOWER_ID }, data: { lat: 35.6004224, lng: 140.0978591 } }),
    prisma.spot.update({ where: { id: PORT_PARK_ID }, data: { lat: 35.5992483, lng: 140.0993372 } }),
    prisma.spot.update({ where: { id: ART_MUSEUM_ID }, data: { lat: 35.6012195, lng: 140.1011459 } }),
    prisma.spot.update({
      where: { id: INAGE_ID },
      data: { lat: 35.619861, lng: 140.060793, visitTime: t(10, 48), memo: newInageMemo },
    }),
    prisma.spot.update({ where: { id: KEMIGAWA_ID }, data: { visitTime: t(12, 11) } }),
    prisma.spot.update({ where: { id: AEON_ID }, data: { visitTime: t(12, 58) } }),
    prisma.spot.update({
      where: { id: MAKUHARI_PARK_ID },
      data: { lat: 35.641941, lng: 140.038259, visitTime: t(14, 36), memo: newMakuhariMemo },
    }),
    prisma.spot.update({
      where: { id: OUTLET_ID },
      data: {
        visitTime: t(15, 59),
        stayDurationMin: 61,
        memo: newOutletMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
      },
    }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
