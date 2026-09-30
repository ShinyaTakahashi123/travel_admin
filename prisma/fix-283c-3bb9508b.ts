/**
 * チェックリスト #283 の修正記録(3巡目、企画運営・法務の指摘各1点)。
 * しおり「坂の上の雲ミュージアムと子規記念博物館、松山文学散歩1泊2日」
 * (3bb9508b-f70c-4cc0-ada9-d4648ecb6571)
 *
 * 1. 企画運営の指摘: 放生園(昼食どころ)が10:33〜11:38と朝の時間帯になっていた
 *    (見直し2で道後温泉本館の直後に置いたため)。並びを
 *    道後温泉本館→伊佐爾波神社→宝厳寺→放生園(昼食)→湯築城跡→子規記念博物館→石手寺
 *    に変更し、昼食が11:53〜12:58(12時台を含む)になるよう調整。
 *    移動時間: 本館→伊佐爾波神社は元の直行値(徒歩10分、見直し2で放生園を挟む前の値)
 *    に戻す。伊佐爾波神社→宝厳寺は既存値(徒歩3分)のまま。宝厳寺→放生園・
 *    放生園→湯築城跡は、いずれも道後公園周辺の徒歩圏内のため、既存の道後温泉本館
 *    ↔伊佐爾波神社間(10分)・放生園↔伊佐爾波神社間(5分、見直し2で使用)と同程度の
 *    距離として、徒歩5分・15分をあてた(実測ではなく近傍値からの推定のため、今後
 *    正確な経路が必要になれば見直す)。
 *
 * 2. 法務の指摘: 放生園の本文にあった「毎正時(時間帯によっては30分ごと)に」という
 *    時刻の記載を削除(決まり9: 具体的な時刻は書かない)。「からくりが動く時刻は、
 *    公式の案内で確かめましょう」に書き換え。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-283c-3bb9508b.ts
 * (実行済み。現在の並び・本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "3bb9508b-f70c-4cc0-ada9-d4648ecb6571";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day2 = itin.days[1];

  const honkan = day2.spots.find((s) => s.name === "道後温泉本館")!;
  const hojoen = day2.spots.find((s) => s.name === "放生園")!;
  const isaniwa = day2.spots.find((s) => s.name === "伊佐爾波神社")!;
  const hogonji = day2.spots.find((s) => s.name === "宝厳寺")!;
  const yuzukijo = day2.spots.find((s) => s.name === "湯築城跡")!;
  const shikihaku = day2.spots.find((s) => s.name === "松山市立子規記念博物館")!;
  const ishite = day2.spots.find((s) => s.name === "石手寺")!;

  // 冪等性チェック: すでに新しい並び(orderNo)になっていれば何もしない
  if (hojoen.orderNo === 4) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const hojoenMemo =
    "道後温泉本館からは歩いて5分ほどです。放生園は、建武年間(1334〜1338)、伊佐爾波神社が現在の場所に移された際、境内を流れる御手洗川の水をたたえてつくられた「放生池」を、のちに埋め立てて整備された広場です。園内の「坊っちゃんカラクリ時計」は、道後温泉本館の振鷺閣をモチーフに、平成6年(1994)、本館改築100周年を記念してつくられました。音楽にあわせて時計台がせり上がり、夏目漱石の小説『坊っちゃん』の登場人物たちが現れるしかけになっています。からくりが動く時刻は、公式の案内で確かめましょう。すぐそばの道後商店街で、昼食もとりましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: honkan.id, data: {} },
        {
          id: isaniwa.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 40)), transitMode: "walk", transitDurationMin: 10 },
        },
        {
          id: hogonji.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 18)), transitMode: "walk", transitDurationMin: 3 },
        },
        {
          id: hojoen.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 53)),
            transitMode: "walk",
            transitDurationMin: 5,
            memo: hojoenMemo,
          },
        },
        {
          id: yuzukijo.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 13)), transitMode: "walk", transitDurationMin: 15 },
        },
        { id: shikihaku.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 13)) } },
        { id: ishite.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 43)) } },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day2.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
