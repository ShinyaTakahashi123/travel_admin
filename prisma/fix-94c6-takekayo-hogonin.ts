/**
 * 94c6f1d5(嵯峨野の紅葉めぐり。秋の嵐山)Day1、法務指摘の残り2点+天龍寺の座標そろえ(2026-10-30)
 * - 天龍寺: 35.015964,135.673772 → #9と同じ曹源池 relation3962914(35.015612,135.673368)
 * - 竹林の小径: 35.017,135.6717 → #9の竹林の道と同じ点 node13751633772(35.016796,135.671266)
 * - 宝厳院: 35.0146,135.6728 → OSM way319336310のNominatim値(35.014162,135.674011)
 * - 竹林の小径の文「耳を澄ませてみてください」→「耳を澄ませてみましょう」
 * 天龍寺(新点)→竹林の小径(新点)は376m/75m=5分で、もとの5分と変わらないため竹林の小径の
 * visitTime・legは変更なし。竹林の小径→野宮神社は353m/75m=5分(もと3分)で変わるため、
 * 野宮神社以降の残りの全スポットをvisitTime+2分で詰める。渡月橋→宝厳院は603m/75m=8分で
 * 変更なし
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const TENRYUJI = "39bc8aa5-0bac-45b2-84df-617835386ad1";
const TAKE = "ad188451-76f7-4c0f-8420-445c7be932c7"; // 竹林の小径
const NONOMIYA = "2ed4f974-6ea9-42c8-8ca0-1dbdd80dd4c2";
const OKOCHI = "bef2ad6a-dd72-42b6-874e-20715fe89655";
const JOJAKKO = "dec99134-5f8e-4344-a2a6-6fac393b92de";
const NISONIN = "7db84cbd-5f99-426a-8009-9369a983183c";
const GIOJI = "b59f502f-5972-4687-a901-05c5eb07a931";
const TOGETSUKYO = "eaea1d4e-d05e-4f56-baa6-e517391b1f91";
const HOGONIN = "fd92e2c2-241f-43c0-9e79-f488f9751a26";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TAKE_MEMO_OLD =
  "天龍寺の北門を出てすぐ、青々とした竹が頭上を覆う約400mの小径です。ここに生い茂るのは、成長すると高さ25mにもなるというモウソウチク(孟宗竹)。紅葉の名所が続く嵯峨野の中で、一年を通して緑を保つ竹林はひと味違う涼やかな景色。風が吹くたびに葉がこすれ合う音にも耳を澄ませてみてください。人力車も行き交う人気の道なので、朝のうちに歩くと比較的ゆったり進めます。この先には、斎王ゆかりの野宮神社があります。";
const TAKE_MEMO_NEW =
  "天龍寺の北門を出てすぐ、青々とした竹が頭上を覆う約400mの小径です。ここに生い茂るのは、成長すると高さ25mにもなるというモウソウチク(孟宗竹)。紅葉の名所が続く嵯峨野の中で、一年を通して緑を保つ竹林はひと味違う涼やかな景色。風が吹くたびに葉がこすれ合う音にも耳を澄ませてみましょう。人力車も行き交う人気の道なので、朝のうちに歩くと比較的ゆったり進めます。この先には、斎王ゆかりの野宮神社があります。";

async function main() {
  const ids = [TENRYUJI, TAKE, NONOMIYA, OKOCHI, JOJAKKO, NISONIN, GIOJI, TOGETSUKYO, HOGONIN];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) {
      throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
    }
  };
  if (Number(byId.get(TENRYUJI)!.lat) !== 35.015964 || Number(byId.get(TENRYUJI)!.lng) !== 135.673772) {
    throw new Error("天龍寺: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(TAKE)!.lat) !== 35.017 || Number(byId.get(TAKE)!.lng) !== 135.6717) {
    throw new Error("竹林の小径: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(HOGONIN)!.lat) !== 35.0146 || Number(byId.get(HOGONIN)!.lng) !== 135.6728) {
    throw new Error("宝厳院: 座標の現在値が期待と不一致");
  }
  if (byId.get(TAKE)!.memo !== TAKE_MEMO_OLD) throw new Error("竹林の小径: memo現在値が期待と不一致");
  checkTime(TAKE, 10, 5, "竹林の小径");
  checkTime(NONOMIYA, 10, 28, "野宮神社");
  checkTime(OKOCHI, 11, 1, "大河内山荘");
  checkTime(JOJAKKO, 11, 54, "常寂光寺");
  checkTime(NISONIN, 12, 49, "二尊院");
  checkTime(GIOJI, 13, 39, "祇王寺");
  checkTime(TOGETSUKYO, 14, 39, "渡月橋");
  checkTime(HOGONIN, 15, 32, "宝厳院");

  console.log("前提の確認OK。\n");
  console.log("[座標] 天龍寺 → 35.015612,135.673368(#9と同じ曹源池relation3962914)");
  console.log("[座標] 竹林の小径 → 35.016796,135.671266(#9の竹林の道と同じnode13751633772)");
  console.log("[座標] 宝厳院 → 35.014162,135.674011(OSM way319336310のNominatim値)");
  console.log("[文] 竹林の小径「耳を澄ませてみてください」→「耳を澄ませてみましょう」");
  console.log("[leg] 天龍寺(新点)→竹林の小径(新点) 376m/75m=5分、もとの5分と変わらないため変更なし。竹林の小径→野宮神社 353m/75m=5分(もと3分)。渡月橋→宝厳院 603m/75m=8分で変更なし");
  console.log("[時刻のつながり、野宮神社以降+2分で後ろへ詰める] 天龍寺発10:00(不変)→竹林の小径10:05(不変)→野宮神社10:28→10:30→大河内山荘11:01→11:03→常寂光寺11:54→11:56→二尊院12:49→12:51→祇王寺13:39→13:41→渡月橋14:39→14:41→宝厳院15:32→15:34(発16:32→16:34)");
  console.log("\n(94c6f1d5は日帰りのため、1泊以上の最終日の時刻ルールの対象外)");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: TENRYUJI }, data: { lat: 35.015612, lng: 135.673368 } });
    await tx.spot.update({
      where: { id: TAKE },
      data: { lat: 35.016796, lng: 135.671266, memo: TAKE_MEMO_NEW },
    });
    await tx.spot.update({
      where: { id: NONOMIYA },
      data: {
        visitTime: t(10, 30),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    });
    await tx.spot.update({ where: { id: OKOCHI }, data: { visitTime: t(11, 3) } });
    await tx.spot.update({ where: { id: JOJAKKO }, data: { visitTime: t(11, 56) } });
    await tx.spot.update({ where: { id: NISONIN }, data: { visitTime: t(12, 51) } });
    await tx.spot.update({ where: { id: GIOJI }, data: { visitTime: t(13, 41) } });
    await tx.spot.update({ where: { id: TOGETSUKYO }, data: { visitTime: t(14, 41) } });
    await tx.spot.update({
      where: { id: HOGONIN },
      data: { lat: 35.014162, lng: 135.674011, visitTime: t(15, 34) },
    });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
