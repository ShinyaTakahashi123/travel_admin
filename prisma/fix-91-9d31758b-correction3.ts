/**
 * #91 城崎の訂正その3。法務が本番で全15か所を確認して見つけた座標の指摘を直す。
 *
 * - 一の湯: バス停の点 → way300742111「一の湯」のNominatim(35.6261621,134.8095333)
 * - 温泉寺: ロープウェイ中間駅「温泉寺駅」の点 → way594622522「温泉寺本堂」の中心
 *   (35.624226,134.800492)
 * - 城崎温泉ロープウェイ: 中間駅(温泉寺駅)の点 → 文芸館から歩いて乗る山麓駅
 *   (node2812948351、35.6252272,134.8037748)。文芸館→ロープウェイの徒歩を15→10分に
 *   実測し直す(山麓駅の方が文芸館に近いため)
 * - 地蔵湯: way300742114のNominatim(35.6267985,134.8126854、約20m)
 * - 柳湯: way300742117のNominatim(35.6264058,134.8102225、約10m)
 * - 玄武洞公園: 名前の地物から27mずれていた点 → node5619256647「玄武洞」
 *   (natural=cave_entrance、35.5881987,134.8048433)
 * - コウノトリの郷公園: 広い自然保護区の中の点 → 同じ名前のバス停node10294323319
 *   (35.5523271,134.8544799)
 * - 有子山稲荷神社: 案内板「出石城跡」の点(神社の点ではない) → すぐそばの実在のnode
 *   6328379893「稲荷神社」(35.4607207,134.8746141、約11m)
 * - 辰鼓楼: node6327962688(35.462167,134.8742733、約6m)
 *
 * 座標を動かした区間の移動を実測し直す。玄武洞公園→コウノトリの郷公園は、コウノトリの
 * 郷公園の点がバス停に移ったことで実測7.6分になり、もとの値20分が閾値(7.6×1.5+5=16.4分)
 * を超えるため13分に直す(-7分)。コウノトリの郷公園→辰鼓楼は、両方の点が動いても実測19.1分
 * (閾値33.65分)でもとの24分のままでよい。この差(-7分)を、出石永楽館の滞在を45分(もとの
 * 長さ)に戻すことで吸収し、終了を16:31(16:30〜17:00の範囲内)に保つ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-91-9d31758b-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-91-9d31758b-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ICHINOYU_ID = "09a6b3df-6ef9-4ad9-aae7-1b3b6ea60003";
const ONSENJI_ID = "ade9fdb9-a7fd-4fff-97aa-e39531dda3af";
const ROPEWAY_ID = "af0777ba-b67e-495e-8054-6db61432bf8d";
const JIZOYU_ID = "9371b3c7-ca2d-43ff-b608-0ad43e152a6b";
const YANAGIYU_ID = "18a015d9-3ff4-400a-9eac-91d723f2c0b3";
const GENBUDO_ID = "b74d2e3b-0fe4-4e7f-9068-6dd6deedf02a";
const KOUNOTORI_ID = "d7e71437-9403-49bc-b494-c62cb5c7681c";
const ARIKOYAMA_ID = "e3a6b494-154c-4843-b106-7f0f1ebf92bb";
const SHINKORO_ID = "9a97a226-5644-4711-ae7d-e4bdad7b8932";
const EIRAKUKAN_ID = "e455278a-21ac-42c0-904a-6e6626d96000";

const BUNGEIKAN_FIND = "徒歩でおよそ15分の城崎温泉ロープウェイへ向かいましょう。";
const BUNGEIKAN_REPLACE = "徒歩でおよそ10分の城崎温泉ロープウェイへ向かいましょう。";

const ROPEWAY_FIND = "城崎文芸館からは、大谿川沿いの柳並木を眺めながら、徒歩でおよそ15分です。";
const ROPEWAY_REPLACE = "城崎文芸館からは、大谿川沿いの柳並木を眺めながら、徒歩でおよそ10分です。";

const KOUNOTORI_FIND = "玄武洞公園からは、車でおよそ20分です。";
const KOUNOTORI_REPLACE = "玄武洞公園からは、車でおよそ13分です。";

const GENBUDO_FIND = "続いては、車でおよそ20分の兵庫県立コウノトリの郷公園へ向かいましょう。";
const GENBUDO_REPLACE = "続いては、車でおよそ13分の兵庫県立コウノトリの郷公園へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const BUNGEIKAN_ID = "84b65fc2-0eb0-4081-ac13-69fffd89427c";
  const [bungeikan, ropeway, kounotori, genbudo] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: BUNGEIKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: ROPEWAY_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KOUNOTORI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GENBUDO_ID } }),
  ]);

  for (const [label, text, find] of [
    ["城崎文芸館", bungeikan.memo ?? "", BUNGEIKAN_FIND],
    ["城崎温泉ロープウェイ", ropeway.memo ?? "", ROPEWAY_FIND],
    ["コウノトリの郷公園", kounotori.memo ?? "", KOUNOTORI_FIND],
    ["玄武洞公園", genbudo.memo ?? "", GENBUDO_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newBungeikanMemo = bungeikan.memo!.replace(BUNGEIKAN_FIND, BUNGEIKAN_REPLACE);
  const newRopewayMemo = ropeway.memo!.replace(ROPEWAY_FIND, ROPEWAY_REPLACE);
  const newKounotoriMemo = kounotori.memo!.replace(KOUNOTORI_FIND, KOUNOTORI_REPLACE);
  const newGenbudoMemo = genbudo.memo!.replace(GENBUDO_FIND, GENBUDO_REPLACE);

  function t(h: number, m: number) {
    return new Date(Date.UTC(1970, 0, 1, h, m));
  }

  console.log("=== #91 訂正その3: 座標の直し ===\n");
  console.log("一の湯: 35.6261621,134.8095333");
  console.log("温泉寺: 35.624226,134.800492");
  console.log("城崎温泉ロープウェイ: 35.6252272,134.8037748(山麓駅)、文芸館からの徒歩10分");
  console.log("地蔵湯: 35.6267985,134.8126854");
  console.log("柳湯: 35.6264058,134.8102225");
  console.log("玄武洞公園: 35.5881987,134.8048433");
  console.log("コウノトリの郷公園: 35.5523271,134.8544799(バス停)");
  console.log("有子山稲荷神社: 35.4607207,134.8746141");
  console.log("辰鼓楼: 35.462167,134.8742733");
  console.log("\n--- 2日目の移動・時刻の連動 ---");
  console.log("玄武洞公園→コウノトリの郷公園: 20→13分(コウノトリの点の移動で実測7.6分、閾値超えのため)");
  console.log("コウノトリの郷公園 10:43(90分)→辰鼓楼12:37(55分)→出石城跡13:35(40分)→有子山稲荷神社14:20(45分)→出石明治館15:10(30分)→出石永楽館15:46(45分、もとの長さに戻す)→終了16:31");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: BUNGEIKAN_ID }, data: { memo: newBungeikanMemo } }),
    prisma.spot.update({
      where: { id: ROPEWAY_ID },
      data: {
        lat: 35.6252272,
        lng: 134.8037748,
        memo: newRopewayMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
      },
    }),
    prisma.spot.update({ where: { id: ONSENJI_ID }, data: { lat: 35.624226, lng: 134.800492 } }),
    prisma.spot.update({ where: { id: ICHINOYU_ID }, data: { lat: 35.6261621, lng: 134.8095333 } }),
    prisma.spot.update({ where: { id: JIZOYU_ID }, data: { lat: 35.6267985, lng: 134.8126854 } }),
    prisma.spot.update({ where: { id: YANAGIYU_ID }, data: { lat: 35.6264058, lng: 134.8102225 } }),
    prisma.spot.update({ where: { id: GENBUDO_ID }, data: { lat: 35.5881987, lng: 134.8048433, memo: newGenbudoMemo } }),
    prisma.spot.update({
      where: { id: KOUNOTORI_ID },
      data: {
        lat: 35.5523271,
        lng: 134.8544799,
        visitTime: t(10, 43),
        memo: newKounotoriMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 13 }] },
      },
    }),
    prisma.spot.update({ where: { id: SHINKORO_ID }, data: { lat: 35.462167, lng: 134.8742733, visitTime: t(12, 37) } }),
    prisma.spot.update({ where: { id: "0699606e-4757-4d02-bb91-6edc83768b4b" }, data: { visitTime: t(13, 35) } }),
    prisma.spot.update({ where: { id: ARIKOYAMA_ID }, data: { lat: 35.4607207, lng: 134.8746141, visitTime: t(14, 20) } }),
    prisma.spot.update({ where: { id: "4adc7594-eff2-45bf-a879-88a5fc708f7b" }, data: { visitTime: t(15, 10) } }),
    prisma.spot.update({ where: { id: EIRAKUKAN_ID }, data: { visitTime: t(15, 46), stayDurationMin: 45 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
